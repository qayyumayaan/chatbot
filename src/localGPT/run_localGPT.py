import click
import json
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceInstructEmbeddings
from langchain.llms import HuggingFacePipeline
from langchain.vectorstores import Chroma
from transformers import LlamaForCausalLM, LlamaTokenizer, pipeline
from constants import CHROMA_SETTINGS, PERSIST_DIRECTORY
import torch

useGPU = True

def load_model(device):
    """
    Select a model on huggingface.
    If you are running this for the first time, it will download a model for you.
    subsequent runs will use the model from the disk.
    """
    
    model_id = "TheBloke/vicuna-7B-1.1-HF"
    tokenizer = LlamaTokenizer.from_pretrained(model_id)
    model = LlamaForCausalLM.from_pretrained(
        model_id,
        # load_in_8bit=True, # set these options if your GPU supports them!
        # device_map='auto',
        # torch_dtype=torch.float16,
        low_cpu_mem_usage=True
    )

    model.to(device)

    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_length=2048,
        temperature=0,
        top_p=0.95,
        repetition_penalty=1.15,
        device=device,
    )

    local_llm = HuggingFacePipeline(pipeline=pipe)
    return local_llm


@click.command()
@click.option(
    "--device_type",
    default="cuda",
    type=click.Choice(
        [
            "cpu",
            "cuda",
            "ipu",
            "xpu",
            "mkldnn",
            "opengl",
            "opencl",
            "ideep",
            "hip",
            "ve",
            "fpga",
            "ort",
            "xla",
            "lazy",
            "vulkan",
            "mps",
            "meta",
            "hpu",
            "mtia",
        ]
    ),
    help="Device to run on. (Default is cuda)",
)
def main(device_type):
    device = torch.device(0) if torch.cuda.is_available() and device_type == "cuda" else torch.device("cpu")
    # device = torch.device(device_type) if torch.cuda.is_available() and device_type == "cuda" else torch.device("cpu")
    string = f"Running on: {device}"
    print(string)

    embeddings = HuggingFaceInstructEmbeddings(
        model_name="hkunlp/instructor-xl", model_kwargs={"device": device}
    )
    # load the vectorstore
    db = Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embeddings,
        client_settings=CHROMA_SETTINGS,
    )
    retriever = db.as_retriever()
    # Prepare the LLM
    llm = load_model(device)
    qa = RetrievalQA.from_chain_type(
        llm=llm, chain_type="stuff", retriever=retriever, return_source_documents=True
    )

    print(json.dumps({"response": "Ready!"}))
    # Interactive questions and answers
    while True:
        query = input()

        if query == "exit":
            break

        print(json.dumps({"response": "Thinking..."}))
        # Get the answer from the chain
        res = qa(query)
        answer, docs = res["result"], res["source_documents"]

        # Print the result
        print(json.dumps({"response": answer}))

        # Print the relevant sources used for the answer
        print(json.dumps({"response": "Sources:"}))

        for document in docs:
            string = "\n> " + document.metadata["source"] + ":"
            print(json.dumps({"response": string}))
            print(json.dumps({"response": document.page_content}))

        print(json.dumps({"response": "Finished printing my sources."}))

if __name__ == "__main__":
    main()
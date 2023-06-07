import sys

def main():
    key = "password"  # Predefined key

    # Prompt the user to enter a word
    user_input = input()

    # Check if the user input matches the key
    if user_input == key:
        print("Correct!")
    else:
        print("That's not it!")

if __name__ == "__main__":
    main()

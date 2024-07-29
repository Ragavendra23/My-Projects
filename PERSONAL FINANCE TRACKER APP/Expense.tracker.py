from Expense import Expense
from datetime import datetime, timedelta

def main():
    print(f"Running Money tracker")
    expense_file_path = "Expenses.csv"
    budget = 25000

    # get user input for money tracker, read it to a file, write files and summarize money expenses
    expense = get_user_expense()

    save_expense_to_file(expense, expense_file_path)

    summarise_expense_to_file(expense_file_path,budget)

def get_user_expense():
    print("🎯getting user money expense")
    expense_name = input("Enter Expense name: ")
    expense_amount = float(input("Enter Expense amount: "))
    print(f"you entered {expense_name}, {expense_amount}")

    expense_category = [
        "food", 'theatre', "travel", "home", "work"
    ]

    while True:
        print("Select a category")

        for index, category in enumerate(expense_category, 1):
            print(index, category)

        value_index = f"[1 - {len(expense_category)}]"
        selected_index = int(input(f"Enter a category number {value_index}: ")) - 1

        if selected_index in range(len(expense_category)):
            selected_category = expense_category[selected_index]
            new_expense = Expense(name=expense_name, category=selected_category, amount=expense_amount)
            return new_expense

        else:
            print("INVALID CATEGORY! PLEASE TRY AGAIN")

def save_expense_to_file(expense: Expense, expense_file_path):
    print(f"🎯saving user money expense: {expense} to {expense_file_path}")
    with open(expense_file_path, "a") as f:
        f.write(f"{expense.name}, {expense.amount}, {expense.category}\n")

def summarise_expense_to_file(expense_file_path, budget):
    print("🎯summarise user money expense: ")
    expenses: list[Expense] = []
    with open(expense_file_path, "r") as f:
        lines = f.readlines()
        for line in lines:
            stripped_line = line.strip()
            expense_name, expense_amount, expense_category = stripped_line.split(",")
            line_expense = Expense(
                name=expense_name,
                amount=float(expense_amount),
                category=expense_category,
            )
            expenses.append(line_expense)
        print(expenses)

    amount_by_category = {}
    for expense in expenses:
        key = expense.category
        if key in amount_by_category:
            amount_by_category[key] += expense.amount
        else:
            amount_by_category[key] = expense.amount

    print("Expenses by category ")
    for key, amount in amount_by_category.items():
        print(f" {key.ljust(10)}: ₹{amount:.2f}")
        
    total_spent = sum([x.amount for x in expenses])
    print(f"Total spent ₹{total_spent:.2f} this month!")

    remaining_budget = budget - total_spent
    print(f"Budget remaining ₹{remaining_budget:.2f}")
    
    def remaining_days_in_month():
        today = datetime.today()
        last_day_of_month = datetime(today.year, today.month + 1, 1) - timedelta(days=1)
    
        remaining_days = (last_day_of_month - today).days
        return remaining_days


    remaining_days = remaining_days_in_month()
    
    daily_budget = remaining_budget / remaining_days
    print(f"Budget per day: ₹{daily_budget:.2f}")

    
    
if __name__ == '__main__':
    main()

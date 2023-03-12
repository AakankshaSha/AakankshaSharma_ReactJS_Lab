
import {useEffect, useState} from "react";
import { Alert, Container, Spinner } from "react-bootstrap";
import IExpenseItem from "../models/expense";
import { getAllExpenseItem } from "../services/expense";
import { ExpenseByPayees } from "./expense-by-payees";
import { ExpenseByPendingAmount } from "./expense-by-pending-amount";
import { ExpenseCreator } from "./expense-creator";
import { ExpenseItems } from "./expense-items";

const ExpenseTracker = () => {

    const [expenseItems, setExpenseItems] = useState<IExpenseItem[]>([]);

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getAllExpenseItemsInvoker = async () => {
            try {
                const response = await getAllExpenseItem();
                console.log(response);
                setExpenseItems(response);
            } catch (error){
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        }
        
        getAllExpenseItemsInvoker();
        
    }, []);

    const refreshParentUponNewExpenseAddition = (newlyCreatedExpenseItem : IExpenseItem) => {

        setExpenseItems(
            [
                newlyCreatedExpenseItem,
                ...expenseItems
            ]
        )
        // Refresh code
    }

    return (
        <Container>
            <h2>Expense Items
                <ExpenseCreator expenseItems={expenseItems} refreshParent={refreshParentUponNewExpenseAddition}></ExpenseCreator>
            </h2>

            
            
            

            {
                loading && (

                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading Expense Tracker App...</span>
                    </Spinner>
                            
                )
            }

            {
                !error && !loading && (
                    <ExpenseItems expenseItems={expenseItems}></ExpenseItems>
                )
            }

            {
                !error && !loading && (
                    <ExpenseByPayees expenseItems={expenseItems}></ExpenseByPayees>
                )
            }

            {
                !error && !loading && (
                    <ExpenseByPendingAmount expenseItems={expenseItems}></ExpenseByPendingAmount>
                )
                
            }

            {
                error && !loading && (
                    <Alert variant="danger">{error.message}</Alert>
                )
            }

        </Container>
    )
}

export {ExpenseTracker}

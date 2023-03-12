import { FormEvent, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap"
import IExpenseItem, { IExpenseCreateItem } from "../models/expense";
import { postExpenseItem } from "../services/expense";
import { getUniquePayeeNames } from "../services/expense-utils";

type ExpenseCreatorModel = {
    expenseItems : IExpenseItem[];
    refreshParent : (newlyCreatedExpenseItem : IExpenseItem) => void;
}
const ExpenseCreator = ({expenseItems, refreshParent} : ExpenseCreatorModel) => {

    const expenseDescriptionRef = useRef<HTMLInputElement>(null);
    const payeeNameRef = useRef<HTMLSelectElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const expenseDateRef = useRef<HTMLInputElement>(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const uniquePayeeNames = getUniquePayeeNames(expenseItems);

    const handleAddExpenseItem = async (event : FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        const expenseDescription = (expenseDescriptionRef?.current?.value as string);
        const payeeName = (payeeNameRef?.current?.value as string);
        const price = parseFloat ( (priceRef?.current?.value as string));
        const expenseDate = new Date((expenseDateRef?.current?.value as string));

        console.log(expenseDescription);
        console.log(payeeName);
        console.log(price);
        console.log(expenseDate);

        const newExpenseItem : IExpenseCreateItem = {
            expenseDescription: expenseDescription,
            payeeName: payeeName,
            price: price,
            date: expenseDate
        }

        // Invoke the POST API
        const newlyCreatedExpenseItem = await postExpenseItem(newExpenseItem);

        console.log("New Expense Item Object " + JSON.stringify(newlyCreatedExpenseItem));

        // Call something on parent
        refreshParent(newlyCreatedExpenseItem);

        handleClose();
    }

    return (
        <>
            <Button variant="primary" className="float-end" onClick={handleShow}>Add</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Expense Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddExpenseItem}>
                        <Form.Group className="mb-3" controlId="expenseDescription">
                            <Form.Label>Expense Description <span className="after" style={{color: "red"}}>*</span></Form.Label>
                            <Form.Control type="text" placeholder="Enter Expense Description" ref={expenseDescriptionRef} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="payeeName">
                            <Form.Label>Payee <span className="after" style={{color: "red"}}>*</span></Form.Label>
                            <Form.Select required as="select" aria-label="Default select example" ref={payeeNameRef}>
                                <option selected disabled value="">SELECT A PAYEE</option>
                                {
                                    uniquePayeeNames.map( (payeeName) => {
                                        return (
                                            <option value={payeeName}>{payeeName}</option>
                                        )
                                    })
                                }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Price <span className="after" style={{color: "red"}}>*</span></Form.Label>
                            <Form.Control type="number" placeholder="Enter Price" ref={priceRef} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="expenseDate">
                            <Form.Label>Expense Date <span className="after" style={{color: "red"}}>*</span></Form.Label>
                            <Form.Control type="date" ref={expenseDateRef} required/>
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{float: "right", marginLeft: "5px"}}>
                            Submit
                        </Button>
                        <Button variant="secondary" onClick={handleClose} style={{float: "right"}}>
                            Close
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </> 
    )
}

export {ExpenseCreator}
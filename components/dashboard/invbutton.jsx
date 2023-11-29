import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

const InventoryForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [pdfName, setPdfName] = useState("inventory"); // Default PDF name
  const [pdfLocation, setPdfLocation] = useState(""); // Default PDF location
  const [tableData, setTableData] = useState([]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5001/inventoryData"); // Change URL if your server is running on a different port
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add your form submission logic here
    // Create a new jsPDF instance
    const pdfDoc = new jsPDF();

    const tableDataArray = tableData.map((row) => [
      row.DispenserLocation,
      row.NumberOfRefills,
      row.Date,
    ]);

    // Add content to the PDF
    pdfDoc.text("Inventory Form", 20, 10);
    pdfDoc.autoTable({
      head: [["Dispenser Location", "Number of Refills", "Date"]],
      body: tableDataArray,
    });

    // Set the name and location from the form inputs
    const fileName = pdfName.trim() || "inventory"; // Use a default name if not provided
    const fileLocation = pdfLocation.trim() || "downloads"; // Use a default location if not provided

    // Save the PDF or open in a new tab/window
    pdfDoc.save(`${fileLocation}/${fileName}.pdf`);

    handleClose();
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Open Inventory
      </Button>

      <Modal
        show={showModal}
        onHide={handleClose}
        dialogClassName="modal-90w"
        backdrop="static"
      >
        <Modal.Header
          style={{ backgroundColor: "gray", color: "white" }}
          closeButton
        >
          <Modal.Title>Inventory Form</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxHeight: "50vh",
          }}
        >
          {/* ... */}
          <div
            style={{
              overflowY: "auto",
            }}
          >
            {/* Example Table */}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Dispenser Location</th>
                  <th>Number of Refills</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.DispenserLocation}</td>
                    <td>{row.NumberOfRefills}</td>
                    <td>{row.Date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Form onSubmit={handleSubmit} style={{ marginTop: "auto" }}>
            {/* Add your form fields here */}
            {/* ... */}
            <Button
              variant="primary"
              type="submit"
              style={{ marginTop: "10px", marginLeft: "290px", width: "130px" }}
            >
              GeneratePDF
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InventoryForm;

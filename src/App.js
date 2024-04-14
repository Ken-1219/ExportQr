import React, { useState } from 'react';
import './stye.css'; // Assuming the CSS filename is "style.css"

function QRCodeGenerator() {
  const [qrData, setQrData] = useState(''); // Data for QR code
  const [qrImage, setQrImage] = useState(null); // Generated QR code image URL
  const [isDataSent, setIsDataSent] = useState(false); // Data sending state
  const [name, setName] = useState(''); // User's name
  const [email, setEmail] = useState(''); // User's email ID

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!qrData || !name || !email) {
      alert('Please enter all fields: QR code data, name, and email ID.');
      return;
    }

    try {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=150x150`;
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setQrImage(imageUrl);

      const dataToSend = {
        Id: qrData,
        Name: name,
        Email: email,
        BooksIssued: 'na',
        BooksReturned: 'na',
        Flag: 'False'
      };

      await sendDataToGoogleSheet(dataToSend);
      setIsDataSent(true);
    } catch (error) {
      console.error('Error generating QR code or sending data:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const sendDataToGoogleSheet = async (data) => {
    try {
      await fetch('https://sheetdb.io/api/v1/lal5vj7xgk12r', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [data],
        }),
      });
      console.log('Data successfully sent to Google Sheets!');
    } catch (error) {
      console.error('Error sending data to Google Sheets:', error);
      alert('An error occurred while sending data to Google Sheets. Please try again.');
    }
  };

  return (
    <div className='container'>
      <div className="qr-generator-container">
        <h1>Hello <span>New User!</span><br/> Welcome to our Library</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="qrData">Enter your Roll Number:</label>
          <input
            type="text"
            id="qrData"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            placeholder="Roll Number"
          />
          <label htmlFor="name">Enter your Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
          <label htmlFor="email">Enter your Email ID:</label>
          <input
            type="email" // Set type to "email" for validation
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email ID"
          />
          <button type="submit">Generate QR Code</button>
        </form>

        {qrImage && <img src={qrImage} alt="Generated QR Code" />}
        {isDataSent && <p>You are now a Member of our Library!</p>}
      </div>
    </div>
  );
}

export default QRCodeGenerator;
import React, { useEffect, useState } from "react";
import { fetchTransactions,downloadRecepit } from "../api/api";
import "../assests/transactions.css"

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchingTransactions = async () => {
      try {
        const res = await fetchTransactions();
        setTransactions(res.data.transactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchingTransactions();
  }, []);

  const handleDownloadReceipt = async (transaction) => {
    try {
      console.log(transaction.id)
      const response = await downloadRecepit(transaction.id)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt_${transaction.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    }
  };
  

  return (
    <div className="container mx-auto mt-10 p-5">
      <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Campaign_ID</th>
            <th className="border p-2">Campaign_Title</th>
            <th className="border p-2">Campaign_Goal_Amount</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="text-center">
                <td className="border p-2">{transaction.campaign_id}</td>
                <td className="border p-2">{transaction.campaign_title}</td>
                <td className="border p-2">₹{transaction.campaign_goal_amount}</td>
                <td className="border p-2">₹{transaction.amount}</td>
                <td className="border p-2">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDownloadReceipt(transaction)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center">
                No donations made yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;

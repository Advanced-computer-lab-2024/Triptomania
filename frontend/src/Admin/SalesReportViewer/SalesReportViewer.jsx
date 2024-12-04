// SalesReportViewer.jsx
import React, { useState } from 'react';
import axiosInstance from '@/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SalesReportViewer = () => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Filter states
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [productId, setProductId] = useState('');
    const [month, setMonth] = useState('');

    const generateReport = async () => {
        setLoading(true);
        setError(null);

        try {
            // Build query parameters
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            if (productId) params.append('productId', productId);
            if (month) params.append('month', month);

            const response = await axiosInstance.get(`/api/admin/generateSalesReport?${params}`, {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf'
                }
            });

            // Create blob URL
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);

            // Cleanup previous URL if it exists
            return () => {
                if (pdfUrl) {
                    URL.revokeObjectURL(pdfUrl);
                }
            };
        } catch (err) {
            console.error('Error generating report:', err);
            setError(err.response?.data?.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    // Download function if needed
    const downloadPDF = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `sales_report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Sales Report Viewer</h2>
                
                <div className="space-y-6">
                    {/* Date Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Start Date
                            </label>
                            <Input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                End Date
                            </label>
                            <Input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Product ID (Optional)
                            </label>
                            <Input 
                                type="text" 
                                value={productId} 
                                onChange={(e) => setProductId(e.target.value)}
                                placeholder="Enter Product ID"
                                className="w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Month (Optional)
                            </label>
                            <Input 
                                type="number" 
                                min="1" 
                                max="12"
                                value={month} 
                                onChange={(e) => setMonth(e.target.value)}
                                placeholder="Enter month (1-12)"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button 
                            onClick={generateReport} 
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </Button>

                        {pdfUrl && (
                            <Button 
                                onClick={downloadPDF}
                                variant="outline"
                            >
                                Download PDF
                            </Button>
                        )}
                    </div>

                    {/* PDF Viewer */}
                    {pdfUrl && (
                        <div className="pdf-viewer mt-6">
                            <iframe
                                src={pdfUrl}
                                className="w-full h-[800px] border rounded-lg"
                                title="PDF Viewer"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesReportViewer;
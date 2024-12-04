import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, Typography, Box, Container, TextField } from '@mui/material';
import axiosInstance from '@/axiosInstance';

const TourGuideRevenueReport = () => {
    const [itineraries, setItineraries] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState('');
    const [month, setMonth] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState(null);

    // Fetch tour guide's itineraries
    useEffect(() => {
        const fetchTourGuideItineraries = async () => {
            try {
                const response = await axiosInstance.get('/api/tourGuide/itinerary/getMyItineraries');
                if (response.data && response.data.status && Array.isArray(response.data.itineraries)) {
                    setItineraries(response.data.itineraries);
                } else {
                    console.error('Invalid itineraries data:', response.data);
                    setItineraries([]);
                }
            } catch (err) {
                console.error('Error fetching itineraries:', err);
                setItineraries([]);
            }
        };
        fetchTourGuideItineraries();
    
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, []);

    const generateReport = async () => {
        try {
            setLoading(true);
            setError(null);
    
            const params = new URLSearchParams();
            params.append('creator', 'true');  // This is crucial - it triggers the tour guide check in backend
            if (selectedItinerary) params.append('itineraryId', selectedItinerary);
            if (month) params.append('month', month);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
    
            const apiUrl = `/api/tourGuide/generateSalesReport?${params.toString()}`;
    
            const response = await axiosInstance.get(apiUrl, {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf'
                }
                
            });
    
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
    
        } catch (err) {
            console.error('Error generating report:', err);
            setError('Failed to generate PDF: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
    const downloadPDF = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `tourguide_revenue_report_${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ mb: 4, color: '#36827f', fontWeight: 'bold' }}>
                    My Itinerary Sales Report
                </Typography>

                <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
                    {/* Itinerary Filter */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Select Itinerary</InputLabel>
                        <Select
                            value={selectedItinerary}
                            onChange={(e) => setSelectedItinerary(e.target.value)}
                            label="Select Itinerary"
                        >
                            <MenuItem value="">
                                <em>All My Itineraries</em>
                            </MenuItem>
                            {Array.isArray(itineraries) && itineraries.map((itinerary) => (
                                <MenuItem key={itinerary._id} value={itinerary._id}>
                                    {itinerary.Name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Month Filter */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Select Month</InputLabel>
                        <Select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            label="Select Month"
                        >
                            <MenuItem value="">
                                <em>All Months</em>
                            </MenuItem>
                            {[...Array(12)].map((_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Date Range Filters */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                            type="date"
                            label="Start Date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Box>

                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Button 
                            variant="contained" 
                            onClick={generateReport}
                            disabled={loading}
                            fullWidth
                            sx={{
                                bgcolor: '#36827f',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: '#2c6663'
                                },
                                '&:disabled': {
                                    bgcolor: '#cccccc'
                                }
                            }}
                        >
                            {loading ? 'Generating Report...' : 'Generate Report'}
                        </Button>

                        {pdfUrl && (
                            <Button 
                                variant="outlined"
                                onClick={downloadPDF}
                                sx={{
                                    borderColor: '#36827f',
                                    color: '#36827f',
                                    '&:hover': {
                                        borderColor: '#2c6663',
                                        bgcolor: 'rgba(54, 130, 127, 0.1)'
                                    }
                                }}
                            >
                                Download PDF
                            </Button>
                        )}
                    </Box>

                    {/* PDF Viewer */}
                    {pdfUrl && (
                        <Box sx={{ 
                            width: '100%', 
                            height: '800px', 
                            border: '1px solid #ccc',
                            borderRadius: 1,
                            overflow: 'hidden'
                        }}>
                            <iframe
                                src={pdfUrl}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title="PDF Viewer"
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default TourGuideRevenueReport;

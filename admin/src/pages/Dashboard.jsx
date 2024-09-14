import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonors, fetchHospitals, fetchBloodStock } from '../store/dataSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { donors, hospitals, bloodStock } = useSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchDonors());
    dispatch(fetchHospitals());
    dispatch(fetchBloodStock());
  }, [dispatch]);

  // Aggregate blood stock quantities by blood group
  const bloodStockAggregation = bloodStock.reduce((acc, stock) => {
    if (acc[stock.bloodGroup]) {
      acc[stock.bloodGroup] += stock.quantity;
    } else {
      acc[stock.bloodGroup] = stock.quantity;
    }
    return acc;
  }, {});

  const bloodStockData = Object.keys(bloodStockAggregation).map((key) => ({
    bloodGroup: key,
    quantity: bloodStockAggregation[key],
  }));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="flex items-center">
            <PeopleIcon fontSize="large" className="mr-4" />
            <div>
              <Typography variant="h5" component="div">
                Total Donors
              </Typography>
              <Typography variant="body2">
                {donors?.length ?? 0}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center">
            <LocalHospitalIcon fontSize="large" className="mr-4" />
            <div>
              <Typography variant="h5" component="div">
                Total Hospitals
              </Typography>
              <Typography variant="body2">
                {hospitals?.length ?? 0}
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center">
            <InventoryIcon fontSize="large" className="mr-4" />
            <div>
              <Typography variant="h5" component="div">
                Total Blood Stock
              </Typography>
              <Typography variant="body2">
                {bloodStock?.length ?? 0}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" className="mb-4">Blood Bank Statistics</Typography>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#1976d2' }}></div>
              <Typography variant="body2">Blood Group</Typography>
            </div>
          </div>
          <div className="h-72">
            <BarChart
              series={[
                {
                  label: '',
                  data: bloodStockData.map(stock => stock.quantity),
                },
              ]}
              height={290}
              xAxis={[{ data: bloodStockData.map(stock => stock.bloodGroup), scaleType: 'band' }]}
              margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
              grid={{ verticalLines: false, horizontalLines: true }}
              barSize={30}
              barSpacing={20}
              colors={['#1976d2']}
              legend={null} // Remove the legend inside the chart
              tooltip={{ show: false }} // Remove tooltips
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

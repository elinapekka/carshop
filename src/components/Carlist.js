import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import AddCar from './AddCar';
import { API_URL } from '../constant';
import EditCar from './EditCar';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';


function Carlist() {
    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');

    const [columnDefs] = useState([
        {field: 'brand', sortable: true, filter:true, width:140},
        {field: 'model', sortable: true, filter:true, width:120},
        {field: 'color', sortable: true, filter:true, width:120},
        {field: 'fuel', sortable: true, filter:true, width:120},
        {field: 'year', sortable: true, filter:true, width:100},
        {field: 'price', sortable: true, filter:true, width:100},
        {cellRenderer: params =>
            <EditCar params={params.data} updatedCar={updateCar} />,
            width: 100
        },
        {cellRenderer: params => 
            <Button 
            size='small' 
            color='error'
            onClick={() => deleteCar(params)}>
                Delete
            </Button>, 
            width: 100
        },
    ])

    const deleteCar = (params) => {
        if (window.confirm("Delete car?")){
            fetch(params.data._links.car.href, { method: 'DELETE' })
            .then(response => {
                if (response.ok){
                    setMsg('Deleted successfully')
                    setOpen(true);
                    getCars();
                } else {
                    alert('Something when wrong in deletion');
                }
            })
            .catch(err => console.log(err));
        }   
    }

    const getCars = () => {
        fetch(API_URL + 'cars')
        .then(response => {
            if (response.ok){
                return response.json()
            } else{
                alert('Something went wrong in GET request')
            }       
        })
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.log(err))
    }

    const addCar = (car) => {
        fetch(API_URL + 'cars', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(car) 
        })
        .then(response => {
            if (response.ok) {
                getCars();
            } else {
                alert('Something went wrong when adding a car: ' + response.statusText);
            }
        })
        .catch(err => console.error(err))
    };

    const updateCar = (updatedCar, url) => {
        fetch(url, { 
            method: 'PUT',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(updatedCar)
        })
        .then(response => {
            if (response.ok){
                setMsg('Edited successfully');
                setOpen(true);
                getCars();
            } else {
                alert('Something when wrong when adding a car.');
            }
        })
        .catch(err => console.log(err));
    }   

    useEffect(() => {
        getCars()
    }, []);

    return (
        <div>

            <div style={{display: 'flex', justifyContent: 'center', padding: 20}}>
            <AddCar addCar={addCar} />
            </div>
            <div 
            className='ag-theme-material' 
            style={{width:'80%', height:600, margin:'auto'}}>
                <AgGridReact
                rowData={cars}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                >
                </AgGridReact>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={msg}
            />
        </div>
    );
}

export default Carlist;
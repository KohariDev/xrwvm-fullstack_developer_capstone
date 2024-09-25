import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);
  const [error, setError] = useState(null);

  const { dealer_id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = "/djangoapp";

  const dealer_url = `${API_BASE_URL}/dealer/${dealer_id}/`;
  const review_url = `${API_BASE_URL}/add_review/`;
  const carmodels_url = `${API_BASE_URL}/get_cars/`;

  const postreview = async () => {
    let name = `${sessionStorage.getItem("firstname") || ''} ${sessionStorage.getItem("lastname") || ''}`.trim();
    // If the first and last name are empty, use the username
    if (!name) {
      name = sessionStorage.getItem("username") || "Anonymous";
    }

    if (!model || review.trim() === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    const [make_chosen, model_chosen] = model.split(" ");

    const jsoninput = JSON.stringify({
      "name": name,
      "dealer_id": parseInt(dealer_id),
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": parseInt(year),
    });

    console.log("Submitting Review:", jsoninput);

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsoninput,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      const json = await res.json();
      if (json.status === 200) {
        navigate(`/dealer/${dealer_id}/`);
      } else {
        alert(json.message || "Error in posting review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.message || "An unexpected error occurred.");
    }
  };

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      
      if(retobj.dealer) {
        setDealer(retobj.dealer);
      } else {
        setError(retobj.message || "Failed to fetch dealer details.");
      }
    } catch (err) {
      console.error("Error fetching dealer details:", err);
      setError("An error occurred while fetching dealer details.");
    }
  };

  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url, {
        method: "GET"
      });
      const retobj = await res.json();
      
      if(retobj.CarModels) {
        setCarmodels(retobj.CarModels);
      } else {
        setError(retobj.message || "Failed to fetch car models.");
      }
    } catch (err) {
      console.error("Error fetching car models:", err);
      setError("Failed to fetch car models.");
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, [dealer_id]);

  return (
    <div>
      <Header/>
      <div style={{ margin: "5%" }}>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <h1 style={{ color: "darkblue" }}>{dealer.name}</h1>
        <textarea
          id='review'
          cols='50'
          rows='7'
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className='input_field'>
          <label>Purchase Date:</label>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            required
          />
        </div>
        <div className='input_field'>
          <label>Car Make & Model:</label>
          <select
            name="cars"
            id="cars"
            onChange={(e) => setModel(e.target.value)}
            value={model}
            required
          >
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map(carmodel => (
              <option key={`${carmodel.CarMake}-${carmodel.CarModel}`} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>        
        </div>
        <div className='input_field'>
          <label>Car Year:</label>
          <input
            type="number"
            onChange={(e) => setYear(e.target.value)}
            value={year}
            max={2023}
            min={2015}
            required
          />
        </div>
        <div>
          <button className='postreview' onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  )
}

export default PostReview;

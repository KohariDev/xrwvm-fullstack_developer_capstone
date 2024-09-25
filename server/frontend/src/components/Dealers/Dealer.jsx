// frontend/src/components/Dealers/Dealer.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState(null); // Initialize as null for better conditional rendering
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);
  const [error, setError] = useState(null);

  const { dealer_id } = useParams();
  const API_BASE_URL = "/djangoapp"; 

  // Construct API URLs without colon and with trailing slashes
  const dealer_url = `${API_BASE_URL}/dealer/${dealer_id}/`;
  const reviews_url = `${API_BASE_URL}/reviews/dealer/${dealer_id}/`;
  const post_review_url = `${API_BASE_URL}/add_review/`;

  // Function to fetch dealer details
  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();

      if (retobj.status === 200) {
        setDealer(retobj.dealer); // Directly set the dealer object
      } else {
        setError(retobj.message || "Failed to fetch dealer details.");
        console.error("Error fetching dealer:", retobj);
      }
    } catch (error) {
      setError("Network error occurred while fetching dealer details.");
      console.error("Fetch error:", error);
    }
  }

  // Function to fetch dealer reviews
  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url, {
        method: "GET"
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const retobj = await res.json();

      // Log the response object to verify its structure
      console.log('Reviews response:', retobj);

      if (retobj.status === 200) {
        if (retobj.reviews && retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      } else {
        setError(retobj.message || "Failed to fetch reviews.");
        console.error('Unexpected response status:', retobj.status);
      }
    } catch (error) {
      setError("Network error occurred while fetching reviews.");
      console.error("Error fetching reviews:", error);
    }
  }

  // Function to determine sentiment icon
  const senti_icon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return positive_icon;
      case "negative":
        return negative_icon;
      default:
        return neutral_icon;
    }
  }

  useEffect(() => {
    if (dealer_id) {
      get_dealer();
      get_reviews();

      if (sessionStorage.getItem("username")) {
        setPostReview(
          <a href={`/postreview/${dealer_id}`}>
            <img
              src={review_icon}
              style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }}
              alt='Post Review'
            />
          </a>
        );
      }
    }
  }, [dealer_id]);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error messages */}
      {dealer ? ( // Conditional rendering based on dealer data
        <>
          <div style={{ marginTop: "10px" }}>
            <h1 style={{ color: "grey" }}>
              {dealer.name}{postReview} {/* Use 'name' instead of 'full_name' */}
            </h1>
            <h4 style={{ color: "grey" }}>
              {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
            </h4>
          </div>
          <div className="reviews_panel">
            {reviews.length === 0 && !unreviewed ? (
              <p>Loading Reviews....</p>
            ) : unreviewed ? (
              <div>No reviews yet!</div>
            ) : (
              reviews.map(review => (
                <div className='review_panel' key={review._id}> {/* Added key */}
                  <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
                  <div className='review'>{review.review}</div>
                  <div className="reviewer">
                    {review.name} {review.car_make} {review.car_model} {review.car_year}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <p>Loading Dealer Information...</p>
      )}
    </div>
  )
}

export default Dealer;

import React, { useState } from "react";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [result, setResult] = useState("");
  const [lat, setLatitude] = useState("");
  const [long, setLongitude] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  // console.log

  const changeHandler = (e) => {
    // console.log("ee",e.target.value)
    setCity(e.target.value);
    // console.log("city is",city)
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log("eeeeee",e)
    console.log("city in submit", city);

    const api = "c6bdf440096cc9eed522c3de1400007f";

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${api}`)
      .then((resp) =>
        resp.json().then((data) => {
          console.log("*********", data);
          console.log("Ddd", data[0].lat, data[0].lon);
          setLatitude(data.lat);
          setLongitude(data.lon);
          // const latt = data[0].lat
          // const lonn = data[0].lon

          // fetch(`api.openweathermap.org/data/2.5/forecast?lat=${latt}&lon=${lonn}&appid=${api}`)
          //     .then(resp => resp.json().then(data=>{
          //         console.log("Dddddddddddddddddddddd",data)

          //     })).catch(error => {
          //         window.alert('cccccity not found')

          //     })
          if (data.length > 0) {
            const latt = data[0].lat;
            const lonn = data[0].lon;

            fetch(
              `http://api.openweathermap.org/data/2.5/forecast?lat=${latt}&lon=${lonn}&appid=${api}`
            )
              .then((resp) => resp.json())
              .then((data) => {
                console.log("Dddddddddddddddddddddd", data.list.slice(0, 5));
                // Process and set state based on the fetched weather data
                // setWeatherData(data.list.slice(0,5))
                setWeatherData(data.list);
              })
              .catch((error) => {
                window.alert("Error fetching weather data");
              });
          } else {
            window.alert("City not found");
          }
        })
      )
      .catch((error) => {
        window.alert("city not found");
      });
  };

  // Function to group weather data by date
  const groupWeatherDataByDate = () => {
    const groupedData = {};
    weatherData.forEach((data) => {
      const date = data.dt_txt.split(" ")[0]; // Extracting date from dt_txt
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(data);
    });
    return groupedData;
  };

  // Filter and display data for 5 days
  const filteredData = groupWeatherDataByDate();
  const days = Object.keys(filteredData).slice(0, 5);

  console.log("days", days);
  console.log("filetered data ", filteredData);

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h2 className="weather-label">Weather in your city</h2>
        <div className="weather-search-container">
          <form onSubmit={submitHandler} className="weather-search-form">
            <input
              type="text"
              name="city"
              onChange={changeHandler}
              className="search-bar"
            />
            {/* <br /> */}
            {/* <br /> */}
            <button type="submit" className="submit-btn">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="weather-body">
        {days.map((item, index) => {
          return (
            <div className="weather-item">
              <table border={1} className="weather-table-item">
                <tr>
                  <th colSpan={2} style={{ backgroundColor: "orange" }}>
                    {item}
                  </th>
                </tr>
                <tr>
                  <th colSpan={2}>Temperature</th>
                </tr>
                <tr>
                  <td>Min</td>
                  <td>Max</td>
                </tr>
                <tr>
                  <td>{filteredData[item][0].main["temp_min"]}</td>
                  <td>{filteredData[item][0].main["temp_max"]}</td>
                </tr>
                <tr>
                  <td>pressure</td>
                  <td>{filteredData[item][0].main["pressure"]}</td>
                </tr>
                <tr>
                  <td>Humidity</td>
                  <td>{filteredData[item][0].main["humidity"]}</td>
                </tr>
              </table>
            </div>
          );
        })}
        {/* body */}
        {/* <form onSubmit={submitHandler}>
          <input type="text" name="city" onChange={changeHandler} />
          <br />
          <br />
          <input type="submit" />
        </form> */}

        <br />

        {/* {days.map((day, index) => (
          <div key={index} className="wet-item">
            <h3>{day}</h3>
            <table className="tb" border={1}>
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>Humidity (%)</th>
                  <th>Pressure (hPa)</th>
                </tr>
              </thead>
              <tbody>
                {filteredData[day].map((data, dataIndex) => (
                  <tr key={dataIndex}>
                    <td>{data.dt_txt}</td>
                    <td>{data.main.humidity}</td>
                    <td>{data.main.pressure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Weather;

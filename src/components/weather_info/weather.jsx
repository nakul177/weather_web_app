import React, { useEffect, useState } from "react";
 import GetUserLocation from "./Location";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import "./Weather.css";
import Bulk from "../db.json";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  linearGradient,
  CartesianGrid,
} from "recharts";

const Weather = () => {
  const [data, setData] = useState([]);
  const [cordData, setCordData] = useState([]);
  const [query, setQuery] = useState("Aurangabad");
  const [active, setActive] = useState(0);
  const [inputStyle, setInputStyle] = useState(false);
  const [display, setDisplay] = useState([]);
  const [displayMode, setDisplayMode] = useState(true);
  const local = GetUserLocation();

  let weatherAPI = {
    key: "daf81f9bedba9c24a0f37473fadff8aa",
    baseUrl: "https://api.openweathermap.org/data/2.5/weather?",
  };

  // Getting Onecall Data
  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord?.lat}&lon=${data.coord?.lon}&units=metric&exclude=minutely&appid=${weatherAPI.key}`
    )
      .then((res) => res.json())
      .then((res) => {
        setCordData(res);
        console.log("onecall:", res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [data.coord?.lat, data.coord?.lon]);

  //  For getting One CallData;
  useEffect(() => {
    fetch(
      `${weatherAPI.baseUrl}q=${query}&units=metric&exclude=hourly,minutely&appid=${weatherAPI.key}`
    )

      

      .then((res) => res.json())
      .then((res) => {
        setData(res);

        let arr = []
        let rec = res.daily
  for(let i=0;i<rec.length;i++){
     arr.push({
      "count": i+1,
"unit": "metric",
"location": "Bangalore",
"data": [
{
"date": "Sun March 06 2020",
"main": "Rain",
"temp": 293.55
},
{
"date": "Sun March 07 2020",
"main": "Sunny",
"temp": 294.64
},
]
     })
  }
  

        console.log("data", res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [query]);

  //For  displaying Day
  const displayDate = (d) => {
    let day = new Date(d * 1000).getDay();

    switch (day) {
      case 0:
        return "Sun";
      case 1:
        return "Mon";
      case 2:
        return "Tue";
      case 3:
        return "Wed";
      case 4:
        return "Thu";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
    }
    return day;
  };

  // Convert String to Hour
  const convertString = (d) => {
    return new Date(d * 1000).getHours();
  };

  // Daily forcast box style handeling onClick
  const dailyCardClick = (index) => {
    setActive(index);
  };

  // Input box style handeling onClick
  const inPutBox = () => {
    setInputStyle((current) => !current);
    {
      !query ? filterBulkData("") : filterBulkData(query);
    }
    setDisplayMode(true);
  };

  // Autosuggetion data handeling onChange
  const filterBulkData = (text) => {
    let matches = Bulk.filter((x) => {
      const regex = new RegExp(`${text}`, "gi");
      return x.city.match(regex) || x.state.match(regex);
    });
    setDisplay(matches);
  };

  // Input box handeling onChange
  const handleChange = (e) => {
    filterBulkData(e.target.value);
    setQuery(e.target.value);
    setDisplayMode(true);
  };

  // Autosuggetion handeling onClick
  const setSearch = (city) => {
    const edit = Bulk.filter((item) => {
      return item.city === city;
    });
    setQuery(edit[0].city);
    setDisplayMode((current) => !current);
  };

  // Chart tooltip handleing onHover
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="chart-desc">
          <div>
            <p>
              {convertString(label) === 0
                ? `${12} am`
                : convertString(label) === 12
                ? `${12} pm`
                : convertString(label) > 0 && convertString(label) < 12
                ? `${convertString(label) % 12} am`
                : `${convertString(label) % 12} pm`}
            </p>
          </div>
          <div>
            <p>
              Temperature: <strong>{Math.round(payload[0].value)}°C</strong>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const sunData = [
    {
      sun: `${convertString(data.sys?.sunrise)}:${new Date(
        data.sys?.sunrise
      ).getMinutes()} am`,
      value: 0,
    },
    { sun: "", value: 10 },
    {
      sun: `${convertString(data.sys?.sunset) - 12}:${new Date(
        data.sys?.sunset
      ).getMinutes()} pm`,
      value: 0,
    },
  ];

  const SunTooltip = ({ active, label }) => {
    if (active) {
      return (
        <div>
          {label.slice(-2) === "am" ? (
            <div className="sun-graph">
              <strong>Sunrise</strong>
              <p>{label}</p>
            </div>
          ) : label.slice(-2) === "pm" ? (
            <div className="sun-graph">
              <strong>Sunset</strong>
              <p>{label}</p>
            </div>
          ) : (
            ""
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <main>
    {/* Top input-box form */}
    <form onSubmit={(e) => e.preventDefault()}>
      <div
        className="input-box"
        style={{
          border: inputStyle ? "2px solid #131313" : "none",
        }}
      >
        <FaMapMarkerAlt className="map-icon" />
        <input
          onClick={inPutBox}
          type="text"
          placeholder="...Search"
          onChange={handleChange}
          value={query}
        />
        <BsSearch
          className="search-icon"
          onClick={() => setDisplayMode((current) => !current)}
        />
      </div>
    </form>

    {/* For auto suggestions */}
    <div className="bulk-data-container">
      {displayMode &&
        display.map((e, i) => (
          <div
            key={i}
            className="bulk-data"
            onClick={() => setSearch(e.city)}
          >
            <div className="bulk-data-info">
              <strong>{e.city},</strong>
              <p>{e.state}</p>
            </div>
            <div className="bulk-data-icon">
              <FaMapMarkerAlt />
            </div>
          </div>
        ))}
    </div>
    </main>
    );
};

export default Weather;
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Search from "@mui/icons-material/Search";
import ApiRequest from "../api/ApiRequest";

import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

function SearchScreen() {
	const [name, setName] = useState("");
	const [hebrewDate, setHebrewDate] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [isError, setIsError] = useState(false);
	const [spinner, setSpinner] = useState(false);

	useEffect(() => {
		if (!name) {
			setIsError(false);
		}
	}, [name]);

	const reset = () => {
		setSpinner(true);
		setErrorMsg("");
		setIsError(false);
		setHebrewDate("");
	};

	const getHebrewDate = async (year = "", month = "", day = "", name) => {
		const response = await ApiRequest(
			`https://www.hebcal.com/converter?cfg=json&gy=${year}&gm=${month}&gd=${day}&g2h=1`
		);
		const data = response.data;

		if (data) {
			setHebrewDate(`${name} was born:  ${data.hebrew}`);
			setSpinner(false);
		}

		if (!year || !month || !day) {
			setErrorMsg("please enter an artist singer not a band!");
			setIsError(true);
			setName("");
		}
	};

	const handleClick = async () => {
		reset();
		try {
			if (!name) {
				setTimeout(() => {
					setSpinner(false);
					setErrorMsg("please provide an artist name");
					setIsError(true);
				}, 1500);
				return;
			}

			const res = await ApiRequest(
				`https://musicbrainz.org/ws/2/artist/?query=artist:"${name}"%20AND%20name:${name}`
			);

			const artistsData = res.data;

			const filteredArtist = artistsData.artists.find((artist) => {
				if (artist.type === "Group") {
					return artist;
				} else if (artist.type === "Person") {
					return (
						artist.name.toLowerCase() === name.toLowerCase() &&
						artist.score === 100
					);
				}
			});

			const artistBirthday = filteredArtist["life-span"].begin;

			if (artistBirthday) {
				const artistBirthdayArray = artistBirthday.split("-");
				const year = artistBirthdayArray[0];
				const month = artistBirthdayArray[1];
				const day = artistBirthdayArray[2];

				if (year && month && day) {
					getHebrewDate(year, month, day, filteredArtist.name);
				} else {
					setErrorMsg("please enter an artist name not a band!");
					setIsError(true);
					setSpinner(false);
				}
			} else {
				throw new Error("Invalid artist name");
			}
		} catch (error) {
			console.log(error);
			setErrorMsg("please enter a correct artist name");
			setIsError(true);
			setSpinner(false);
		}
	};

	return (
		<>
			<div className="search-box">
				<TextField
					type="search"
					onChange={(e) => setName(e.target.value)}
					placeholder="Search for an artist name"
					style={{ width: 500, textAlignLast: "start" }}
					variant="standard"
					helperText={isError ? errorMsg : ""}
					error
					id="outlined-error-helper-text"
				/>
				<div className="button-wrapper">
					{spinner ? (
						<CircularProgress />
					) : (
						<Button onClick={handleClick} endIcon={<Search />} variant="text" />
					)}
				</div>
			</div>
			<h1 className="output">{isError ? "" : hebrewDate}</h1>
		</>
	);
}

export default SearchScreen;

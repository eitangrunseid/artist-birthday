import React, { useEffect, useState } from "react";
import { Input, Button } from "@mui/material";
import Search from "@mui/icons-material/Search";
import ApiRequest from "../api/ApiRequest";

function SearchScreen() {
	const [name, setName] = useState("");
	const [hebrewDate, setHebrewDate] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [isError, setIsError] = useState(false);

	const handleClick = async () => {
		setErrorMsg("");
		setIsError(false);
		try {
			if (!name) {
				setErrorMsg("please provide an artist name");
				setIsError(true);
				return;
			}

			const res = await ApiRequest(
				`https://musicbrainz.org/ws/2/artist/?query=artist:"${name}"`
			);
			console.log("artist:", res.data);
			if (res.data.count === 0) {
				setErrorMsg("please enter a valid artist name");
				setIsError(true);
				return;
			}
			const artistBirthday = res.data.artists[0]["life-span"].begin;

			if (artistBirthday) {
				const artistBirthdayArray = artistBirthday.split("-");
				const year = artistBirthdayArray[0];
				const month = artistBirthdayArray[1];
				const day = artistBirthdayArray[2];

				if (year && month && day) {
					setErrorMsg("");
					setIsError(false);
					const response = await ApiRequest(
						`https://www.hebcal.com/converter?cfg=json&gy=${year}&gm=${month}&gd=${day}&g2h=1`
					);
					const data = response.data;
					setHebrewDate(data.hebrew);
				}
				if (!year || !month || !day) {
					setErrorMsg("please enter an artist singer not a band");
					setIsError(true);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div>hello</div>
			<Input
				placeholder="Search for an artist name"
				onChange={(e) => setName(e.target.value)}
			/>
			<Button onClick={handleClick} variant="contained" endIcon={<Search />}>
				Search
			</Button>
			<h1>{isError ? errorMsg : hebrewDate}</h1>
		</>
	);
}

export default SearchScreen;

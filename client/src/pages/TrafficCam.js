import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TrafficCard from '../components/TrafficCard';
import CamLocation from '../CameraLocation';
import CheckBoxes from '../components/CheckBoxes';

const TrafficCam = () => {
	const [trafficImg, setTrafficImg] = useState([]);
	const [resultImg, setResultImg] = useState([]);
	const history = useHistory();

	useEffect(() => {
		const camImageUrl = 'http://localhost:4444/proxyServer/traffic_cam';

		axios
			.get(camImageUrl)
			.then((res) => {
				setTrafficImg(res.data);
				console.log(res.data, 'hellooo');
			})
			.catch((err) => {
				console.log(err.data);
			});
	}, []);

	const area = {}; //  to create an object with boolean values
	for (const element of CamLocation) {
		area[element.area] = false;
	}

	const result = []; // to segregate the key with "true" value into a single array
	const [check, setCheck] = useState(area);

	for (const element of Object.keys(check)) {
		if (check[element] === true) {
			result.push(element);
		}
	}

	const handleChange = (event) => {
		setCheck({ ...check, [event.target.name]: event.target.checked });
	};

	useEffect(() => {
		//match the key with "true" value with the data.
		if (check) {
			const resultAtLast = [];
			for (const element of result) {
				for (const item of CamLocation) {
					if (element === item.area) {
						resultAtLast.push(item);
					}
				}
			}
			setResultImg(resultAtLast);
		}
		// query string for traffic cam checkbox
		history.replace({
			pathname: '/traffic_cam',
			search: qs.stringify({ area: result }),
		});
	}, [check]);

	return (
		<div>
			<Container justify="center">
				<Box display="flex" justifyContent="center">
					<Typography variant="h3">Traffic Cameras</Typography>
				</Box>
				<CheckBoxes area={area} check={check} handleChange={handleChange} />

				<Grid container>
					{trafficImg &&
						trafficImg.map((element) =>
							resultImg.map((item) => {
								if (element.camera_id === item.camera_id)
									return (
										<Grid item key={element.camera_id}>
											<TrafficCard
												img={element.image}
												location={element.location}
												id={element.camera_id}
												road={item.location}
												cluster={item.area}
											/>
										</Grid>
									);
							})
						)}
				</Grid>
			</Container>
		</div>
	);
};

export default TrafficCam;

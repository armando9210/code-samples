import React from 'react';

function CheckMark({
	style = {},
	height = 16,
	width = 16,
	viewBox = "0 0 24 24",
	color = ''
}) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" style={style} height={height} viewBox={viewBox} width={width}>
			<path d="M0 0h24v24H0z" fill="none"/>
			<path fill={color} d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
		</svg>
	);
}

export default CheckMark;
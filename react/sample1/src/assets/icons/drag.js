import React from 'react';

function Drag({
		style = {},
		height = 16,
		width = 16,
		viewBox = '0 0 24 24'
	}) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" style={style} height={height} viewBox={viewBox} width={width}>
			<path d="M6.403 8.1l-4.229.004.635-.635c.22-.22.22-.578 0-.799-.22-.22-.578-.22-.799 0L.413 8.267c-.051.053-.092.116-.12.184-.057.138-.057.293 0 .431.028.069.069.131.12.184l1.597 1.597c.22.22.578.22.799 0 .22-.22.22-.578 0-.798l-.635-.635 4.229.004c.313 0 .567-.254.567-.567 0-.313-.254-.567-.567-.567zm2.16-5.26l.635.636c.22.22.578.22.799 0 .22-.22.22-.578 0-.799L8.399 1.08c-.053-.052-.115-.092-.183-.12-.138-.057-.294-.057-.432 0-.068.028-.13.068-.183.12L6.003 2.677c-.22.22-.22.578 0 .799.221.22.579.22.8 0l.634-.635-.004 4.228c0 .151.059.296.165.402.107.107.251.166.402.165.15.001.295-.058.402-.165.106-.106.166-.251.165-.402l-.004-4.228zm1.434 11.018c-.221-.22-.579-.22-.8 0l-.634.635.004-4.23c0-.312-.254-.566-.567-.566-.313 0-.567.254-.567.567l.004 4.229-.635-.635c-.22-.22-.578-.22-.799 0-.22.22-.22.578 0 .798l1.598 1.598c.053.051.115.092.183.12.138.056.294.056.432 0 .068-.028.13-.069.183-.12l1.598-1.598c.22-.22.22-.578 0-.798zm5.71-4.976c.057-.138.057-.293 0-.431-.028-.068-.069-.13-.12-.184L13.99 6.67c-.22-.22-.578-.22-.799 0-.22.22-.22.578 0 .799l.635.635L9.597 8.1c-.15-.001-.295.059-.401.165-.107.107-.166.251-.166.402 0 .15.06.295.166.401.106.107.25.166.401.166l4.229-.004-.635.635c-.22.22-.22.578 0 .798.22.22.578.22.799 0l1.597-1.597c.051-.053.092-.115.12-.184z" transform="translate(0 -.667)"/>
		</svg>
	);
}

export default Drag;
import React from 'react'

const VideoDisplay = () => {
    const display = () => {
        const videoId = "FSAz556s0fM"; // Only the ID, not full URL
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&controls=0&modestbranding=1`;
        iframe.width = "560";
        iframe.height = "315";
        iframe.frameBorder = "0";
        iframe.allow = "autoplay; encrypted-media";
        iframe.allowFullscreen = true;
        document.getElementById('video-container').appendChild(iframe);
    }

    display();
    return (
        <>
            <div>VideoDisplay</div>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/FSAz556s0fM?si=FgDMevFUJc6MmQ17" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

            <div id="video-container"></div>

        </>
        // https://youtu.be/FSAz556s0fM?si=o5BOiY-A78S5_Nis


    )
}

export default VideoDisplay
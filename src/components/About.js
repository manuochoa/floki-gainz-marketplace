import React from 'react'

export default function About({ refProp }) {
    return (
        <div className="about container" ref={refProp}>
            <div className="about__wrapper">
                <h1 className="title about__title">About us</h1>
                <p className="about__text">
                    A scared lil pup, abandoned on the rough city streets of Gainzsville, Floki had no choice but to train as hard as he could. Now, bigger, buffer, and more bullish than ever, nothing can stop Floki from getting his $GAINZ.
                    <br /><br />
                    FlokiGainz ($GAINZ) is the newest, most comprehensive fitness token yet, launching in quarter 1 of 2022.
                    Behind $GAINZ is a team of over 15 qualified and experienced crypto specialist, ranging from 2 expert marketeers (1 with extensive real-world organisational experience, and the later with an intricate background in crypto projects), to our own extremely talented graphic designer, an experienced developer, and multiple consultants within crypto and the fitness industry.
                    <br /><br />
                    $GAINZ stands to be the biggest, buffest token launch of 2022. We hope you’re all ready for what we will achieve together.
                </p>
            </div>
        </div>
    )
}

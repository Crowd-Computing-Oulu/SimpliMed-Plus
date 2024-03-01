import React from "react";
import "./loading.css";

export default function Loading() {
  return (
    <div className="loader-container ">
      <div>
        <svg
          className="pl"
          viewBox="0 0 200 200"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
              <stop offset="0%" stopColor="hsl(187,76.5%,50%)" />
              <stop offset="100%" stopColor="hsl(7,76.5%,50%)" />
            </linearGradient>
            <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(187,76.5%,50%)" />
              <stop offset="100%" stopColor="hsl(7,76.5%,50%)" />
            </linearGradient>
          </defs>
          <circle
            className="pl__ring"
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="url(#pl-grad1)"
            stroke-width="36"
            stroke-dasharray="0 257 1 257"
            stroke-dashoffset="0.01"
            stroke-linecap="round"
            transform="rotate(-90,100,100)"
          />
          <line
            className="pl__ball"
            stroke="url(#pl-grad2)"
            x1="100"
            y1="18"
            x2="100.01"
            y2="182"
            stroke-width="36"
            stroke-dasharray="1 165"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <div className="loader-description">
        <p>loading...</p>
        <span>It might take a while</span>
      </div>
    </div>
  );
}

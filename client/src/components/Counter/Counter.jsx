import React from "react";
import "./Counter.css";
import("./couter");

const Counter = () => {
  return (
    <div class="counter-wrapper" id="users">
      <div class="counter">
        <h1 class="count" data-target="1254">
          0
        </h1>
        <p>New Visiters Every Week</p>
        <button>Join</button>
      </div>
      <div class="counter">
        <h1 class="count" data-target="12168">
          0
        </h1>
        <p>Happy customers</p>
        <button>Join</button>
      </div>
      <div class="counter">
        <h1 class="count" data-target="2172">
          0
        </h1>
        <p>Won Amazing Awards</p>
        <button>Join</button>
      </div>
      <div class="counter">
        <h1 class="count" data-target="732">
          0
        </h1>
        <p>New Listing Every Week</p>
        <button>Join</button>
      </div>
    </div>
  );
};

export default Counter;

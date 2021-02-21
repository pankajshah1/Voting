import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ReactDOM from "react-dom";

configure({ adapter: new Adapter() });

import VotingContract from "../../contracts/Voting.json";
import getWeb3 from "../../getWeb3";
import CastVote from "./castVote";

describe("getting dom element", () => {

  // it("renders without crashing", () => {
  //   const div = document.createElement("div");
  //   ReactDOM.render(<CastVote />, div);
  //   ReactDOM.unmountComponentAtNode(div);
  // }); 

  it("should check for span in component", () => {
    const wrapper = shallow(<CastVote />);
    const msg = <span className="marquee">Voting Section</span>;
    expect(wrapper.contains(msg)).toBe(true);
  });

  it("should check the value of web3 ", () => {
      const wrapper = shallow(<CastVote />);
       expect(wrapper.state("storageValue")).toBe(0);
       wrapper.find("#button").simulate("click");
       expect(wrapper.state("storageValue")).toBe(50);
  })
});

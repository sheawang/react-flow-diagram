// @flow

import React from "react";
import style from "styled-components";

import type { EntityState, Links, Point, EntityId, EntityModel } from "../entity/reducer";
import { setEntities } from "../entity/reducer";
import { Input, Select, InputGroup } from "antd";
import { connect } from "react-redux";
import calcLinkPoints from "./calcLinkPoints";
import { State } from "../diagram/reducer";

/*
 * Presentational
 * ==================================== */

const Line = style.path`
  fill: none;
  stroke-width: .1em;
  stroke: black;
  stroke-linejoin: round;
  marker-end: url("#arrow-end");
`;

const InteractionLine = style.path`
  fill: none;
  stroke-width: 1em;
  stroke: transparent;
  stroke-linejoin: round;
`;
const InputPosition = style.div`
  display: block;
`;
const { Option } = Select;
const Options = [ "1...1" ,"1...n" , "n...n" ];
export type SelectProps = {
  value: string,
  handleSelect: () => void
};
const SelectAfter = (props: SelectProps) => {
  return (
    <Select
      placeholder="请选择模型关系"
      defaultValue={props.value}
      onChange={(value)=>props.handleSelect(value)}
    >
    {Options.map((option)=>(<Option key={option}>{option}</Option>))}
    </Select>
  );
};
type ArrowBodyProps = {
  points: string,
  id: EntityId,
  label: ?string,
  edited: boolean,
  handleSubmit: () => void
};
class ArrowBody extends React.Component<ArrowBodyProps> {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      edited: props.edited
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this)
  }
  componentDidMount() {
    if (!this.state.edited) {
      this.polyline.addEventListener("click", this.handleClick);
    }
  }

  componentWillUnmount() {
    if (!this.state.edited) {
      this.polyline.removeEventListener("click", this.handleClick);
    }
  }
  handleChange(ev) {
    switch (ev.key) {
      case "Enter":
        this.setState({ ...this.state, edited: false });
        this.props.handleSubmit({ id: this.props.id, label: this.state.label });
        break;
      // no default
      default:
        this.setState({
          label: ev.currentTarget.value,
          edited: this.state.edited
        });
    }
  }
  handleClick() {
    this.setState({
      edited: true
    });
  }
  handleSelect(select:string) {
    this.setState({ label:select, edited: false });
    this.props.handleSubmit({ id: this.props.id, label: select });
  }
  render() {
    const { points, id } = this.props;
    const { label } = this.state;
    const notEdited = (
      <g ref={ref => (this.polyline = ref)}>
        <Line d={points} id={`line${id}`} />
        <InteractionLine d={points} />
        {label && (
          <text dy="-.25rem">
            <textPath
              xlinkHref={`#line${id}`}
              startOffset="33%"
              style={{ fontSize: ".8rem" }}
            >
              {label}
            </textPath>
          </text>
        )}
      </g>
    );
    const start = points
      .split("L")[0]
      .split("M")[1]
      .split(",");
    const end = points.split("L")[1].split(",");
    const editedMode = (
      <g>
        <Line d={points} id={`line${id}`} />
        <InteractionLine d={points} />

        <foreignObject
          width="100"
          height="50"
          x={(Number(start[0]) + Number(end[0])) / 2}
          y={(Number(start[1]) + Number(end[1])) / 2}
        >
          {/* <Input
            placeholder="请输入关系"
            value={label}
            onChange={ev => this.handleChange(ev)}
            onPressEnter={ev => this.handleChange(ev)}
          /> */}
          <SelectAfter
            value={label}
            handleSelect={this.handleSelect}
          ></SelectAfter>
        </foreignObject>
      </g>
    );
    if (this.state.edited) {
      return editedMode;
    } else {
      return notEdited;
    }
  }
}

/*
 * Container
 * ==================================== */

const pointsToString = (points: Array<Point>): string =>
  points
    .reduce((acc, curr) => `${acc} ${curr.x},${curr.y} L`, "M")
    .replace(/ L$/, "");


type ArrowBodyContainerProps = {
  from: string,
  links: Links,
  entities: EntityState,
  setEntities: EntityState => EntityAction
};
class ArrowBodyContainer extends React.PureComponent<ArrowBodyContainerProps> {
  handleSubmit = (link: any) => {
    const currentTarget = this.props.entities.find(
      entity => entity.id === this.props.from
    );
    const isExist = currentTarget.linksTo.find(lk=>lk.target === link.id);
    if(isExist) {
      currentTarget.linksTo.map(tg =>
        tg.target === link.id ? { ...tg, label: link.label } : tg
      );
    }else {
      currentTarget.linksTo.add({
        target: link.id,
        label: link.label,
        edited: false
      })
    }
    this.props.setEntities(
      this.props.entities.map(entity =>
        entity.id === currentTarget.id ? currentTarget : entity
      )
    );
  };
  render() {
    return (
      <g>
        {this.props.links.map(
          link =>
            link.points && (
              <ArrowBody
                key={link.target}
                id={link.target}
                label={link.label}
                points={pointsToString(link.points)}
                edited={link.edited}
                handleSubmit={link => this.handleSubmit(link)}
              />
            )
        )}
      </g>
    );
  }
}
// const ArrowBodyContainer = (props: ArrowBodyContainerProps) => (
//   <g>
//     {props.links.map(
//       link =>
//         link.points && (
//           <ArrowBody
//             key={link.target}
//             id={link.target}
//             label={link.label}
//             points={pointsToString(link.points)}
//             edited={link.edited}
//             onClick={() => {
//               link.edited = !link.edited;
//             }}
//             handleSubmit={(link) => handleSubmit(props.entities,props.from, link)}
//           />
//         )
//     )}
//   </g>
// );
const mapStateToProps = (state: State) => ({
  entities: state.entity
});
export default connect(mapStateToProps, {
  setEntities
})(ArrowBodyContainer);

// @flow

import React from "react";
import style from "styled-components";

import type {
  EntityState,
  Links,
  Point,
  EntityId,
  EntityModel
} from "../entity/reducer";
import { setModel } from "../entity/reducer";
import { Select, Button, Input } from "antd";
import { connect } from "react-redux";
import calcLinkPoints from "./calcLinkPoints";
import { State } from "../diagram/reducer";
import { store as diagramStore } from "../diagram/component";
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
const { Option } = Select;
const Options = ["1...1", "1...n", "n...n"];
export type SelectProps = {
  value: string,
  handleSelect: () => void,
  handleDelete: () => void
};
const SelectAfter = (props: SelectProps) => {
  return (
    <div>
      {props.hasUnderLabel && (
        <Input
          placeholder="请输入"
          value={props.inputValue}
          onChange={props.handleInputValueChange}
          onPressEnter={props.handleInputValueChange}
        />
      )}
      <Select
        placeholder="请选择模型关系"
        defaultValue={props.value ? props.value : "1..1"}
        onChange={value => props.handleSelect(value)}
      >
        {Options.map(option => (
          <Option key={option}>{option}</Option>
        ))}
      </Select>
      <Button icon="delete" onClick={() => props.handleDelete()}></Button>
    </div>
  );
};
type ArrowBodyProps = {
  points: string,
  id: EntityId,
  from: EntityId,
  label: ?string,
  underLabel?: string,
  edited: boolean,
  handleSubmit: () => void,
  handleDelete: () => void
};
class ArrowBody extends React.Component<ArrowBodyProps> {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      edited: props.edited,
      underLabel: props.underLabel ? props.underLabel : ""
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
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
  handleClick() {
    this.setState({
      edited: true
    });
  }
  handleSelect(select: string) {
    this.setState({ label: select, edited: false });
    this.props.handleSubmit({
      id: this.props.id,
      underLabel: this.state.underLabel,
      label: select
    });
  }
  handleDelete() {
    this.props.handleDelete();
  }
  handleInputValueChange(ev: any) {
    switch (ev.key) {
      case "Enter":
        this.setState({ edited: false });
        this.props.handleSubmit({
          id: this.props.id,
          underLabel: this.state.underLabel,
          label: this.state.label
        });
        break;
      case "Escape":
        this.setState({ edited: false });
        break;

      // no default
      default:
        this.setState({
          underLabel: ev.currentTarget.value
        });
    }
  }
  render() {
    const { points, id, from } = this.props;
    const pointsStr = pointsToString(points);
    const { label, underLabel } = this.state;
    const newId = `From${from}To${id}`;
    const notEdited = (
      <g ref={ref => (this.polyline = ref)}>
        <Line d={pointsStr} id={`line${newId}`} />
        <InteractionLine d={pointsStr} />
        {label && (
          <text dy=".8rem">
            <textPath
              xlinkHref={`#line${newId}`}
              startOffset="33%"
              style={{ fontSize: ".8rem" }}
            >
              {label}
            </textPath>
          </text>
        )}
        {underLabel && (
          <text dy="-.25rem">
            <textPath
              xlinkHref={`#line${newId}`}
              startOffset="33%"
              style={{ fontSize: ".8rem", fontWeight: "bold" }}
            >
              {underLabel}
            </textPath>
          </text>
        )}
      </g>
    );
    const start = points[0];
    const end = points[1];
    const editedMode = (
      <g>
        <Line d={pointsStr} id={`line${newId}`} />
        <InteractionLine d={pointsStr} />

        <foreignObject
          width="100"
          height="100"
          x={(Number(start.x) + Number(end.x)) / 2}
          y={(Number(start.y) + Number(end.y)) / 2}
        >
          <SelectAfter
            value={label}
            handleSelect={this.handleSelect}
            handleDelete={() => this.handleDelete()}
            hasUnderLabel={underLabel}
            inputValue={underLabel}
            handleInputValueChange={this.handleInputValueChange}
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
  setModel: any => EntityAction
};
class ArrowBodyContainer extends React.PureComponent<ArrowBodyContainerProps> {
  handleSubmit = (link: any) => {
    const currentTarget = this.props.entities.find(
      entity => entity.id === this.props.from
    );
    const { label, underLabel } = link;
    const isExist = currentTarget.linksTo.find(lk => lk.target === link.id);
    if (currentTarget.linksTo && isExist) {
      currentTarget.linksTo = currentTarget.linksTo.map(tg =>
        tg.target === link.id ? { ...tg, label, custom: { underLabel } } : tg
      );
    } else {
      currentTarget.linksTo = [
        ...currentTarget.linksTo,
        ...[
          {
            target: link.id,
            label,
            custom: { underLabel },
            edited: false
          }
        ]
      ];
    }
    this.props.setModel(currentTarget);
  };
  handleDelete(target: string) {
    const currentTarget = this.props.entities.find(
      et => et.id === this.props.from
    );
    const linkIndex = currentTarget.linksTo.findIndex(
      lk => lk.target === target
    );
    if (linkIndex >= 0) {
      currentTarget.linksTo.splice(linkIndex, 1);
    }
    this.props.setModel(currentTarget);
  }
  render() {
    return (
      <g>
        {this.props.links.map(
          link =>
            link.points && (
              <ArrowBody
                key={link.target}
                id={link.target}
                from={this.props.from}
                label={link.label}
                underLabel={
                  link.custom && link.custom.underLabel
                    ? link.custom.underLabel
                    : ""
                }
                points={link.points}
                edited={link.edited}
                handleSubmit={link => this.handleSubmit(link)}
                handleDelete={() => this.handleDelete(link.target)}
              />
            )
        )}
      </g>
    );
  }
}
const mapStateToProps = (state: State) => ({
  entities: state.entity
});
export default connect(mapStateToProps, {
  setModel
})(ArrowBodyContainer);

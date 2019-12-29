var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteralLoose(["\n  fill: none;\n  stroke-width: .1em;\n  stroke: black;\n  stroke-linejoin: round;\n  marker-end: url(\"#arrow-end\");\n"], ["\n  fill: none;\n  stroke-width: .1em;\n  stroke: black;\n  stroke-linejoin: round;\n  marker-end: url(\"#arrow-end\");\n"]),
    _templateObject2 = _taggedTemplateLiteralLoose(["\n  fill: none;\n  stroke-width: 1em;\n  stroke: transparent;\n  stroke-linejoin: round;\n"], ["\n  fill: none;\n  stroke-width: 1em;\n  stroke: transparent;\n  stroke-linejoin: round;\n"]),
    _templateObject3 = _taggedTemplateLiteralLoose(["\n  display: block;\n"], ["\n  display: block;\n"]);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

import React from "react";
import style from "styled-components";

import { setEntities } from "../entity/reducer";
import { Input, Select, InputGroup } from "antd";
import { connect } from "react-redux";
import calcLinkPoints from "./calcLinkPoints";
import { State } from "../diagram/reducer";

/*
 * Presentational
 * ==================================== */

var Line = style.path(_templateObject);

var InteractionLine = style.path(_templateObject2);
var InputPosition = style.div(_templateObject3);
var Option = Select.Option;

var Options = ["1...1", "1...n", "n...n"];

var SelectAfter = function SelectAfter(props) {
  return React.createElement(
    Select,
    {
      placeholder: "\u8BF7\u9009\u62E9\u6A21\u578B\u5173\u7CFB",
      defaultValue: props.value,
      onChange: function onChange(value) {
        return props.handleSelect(value);
      }
    },
    Options.map(function (option) {
      return React.createElement(
        Option,
        { key: option },
        option
      );
    })
  );
};

var ArrowBody = function (_React$Component) {
  _inherits(ArrowBody, _React$Component);

  function ArrowBody(props) {
    _classCallCheck(this, ArrowBody);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      label: props.label,
      edited: props.edited
    };
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleSelect = _this.handleSelect.bind(_this);
    return _this;
  }

  ArrowBody.prototype.componentDidMount = function componentDidMount() {
    if (!this.state.edited) {
      this.polyline.addEventListener("click", this.handleClick);
    }
  };

  ArrowBody.prototype.componentWillUnmount = function componentWillUnmount() {
    if (!this.state.edited) {
      this.polyline.removeEventListener("click", this.handleClick);
    }
  };

  ArrowBody.prototype.handleChange = function handleChange(ev) {
    switch (ev.key) {
      case "Enter":
        this.setState(_extends({}, this.state, { edited: false }));
        this.props.handleSubmit({ id: this.props.id, label: this.state.label });
        break;
      // no default
      default:
        this.setState({
          label: ev.currentTarget.value,
          edited: this.state.edited
        });
    }
  };

  ArrowBody.prototype.handleClick = function handleClick() {
    this.setState({
      edited: true
    });
  };

  ArrowBody.prototype.handleSelect = function handleSelect(select) {
    this.setState({ label: select, edited: false });
    this.props.handleSubmit({ id: this.props.id, label: select });
  };

  ArrowBody.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        points = _props.points,
        id = _props.id;
    var label = this.state.label;

    var notEdited = React.createElement(
      "g",
      { ref: function ref(_ref) {
          return _this2.polyline = _ref;
        } },
      React.createElement(Line, { d: points, id: "line" + id }),
      React.createElement(InteractionLine, { d: points }),
      label && React.createElement(
        "text",
        { dy: "-.25rem" },
        React.createElement(
          "textPath",
          {
            xlinkHref: "#line" + id,
            startOffset: "33%",
            style: { fontSize: ".8rem" }
          },
          label
        )
      )
    );
    var start = points.split("L")[0].split("M")[1].split(",");
    var end = points.split("L")[1].split(",");
    var editedMode = React.createElement(
      "g",
      null,
      React.createElement(Line, { d: points, id: "line" + id }),
      React.createElement(InteractionLine, { d: points }),
      React.createElement(
        "foreignObject",
        {
          width: "100",
          height: "50",
          x: (Number(start[0]) + Number(end[0])) / 2,
          y: (Number(start[1]) + Number(end[1])) / 2
        },
        React.createElement(SelectAfter, {
          value: label,
          handleSelect: this.handleSelect
        })
      )
    );
    if (this.state.edited) {
      return editedMode;
    } else {
      return notEdited;
    }
  };

  return ArrowBody;
}(React.Component);

/*
 * Container
 * ==================================== */

var pointsToString = function pointsToString(points) {
  return points.reduce(function (acc, curr) {
    return acc + " " + curr.x + "," + curr.y + " L";
  }, "M").replace(/ L$/, "");
};

var ArrowBodyContainer = function (_React$PureComponent) {
  _inherits(ArrowBodyContainer, _React$PureComponent);

  function ArrowBodyContainer() {
    var _temp, _this3, _ret;

    _classCallCheck(this, ArrowBodyContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args))), _this3), _this3.handleSubmit = function (link) {
      var currentTarget = _this3.props.entities.find(function (entity) {
        return entity.id === _this3.props.from;
      });
      var isExist = currentTarget.linksTo.find(function (lk) {
        return lk.target === link.id;
      });
      if (isExist) {
        currentTarget.linksTo.map(function (tg) {
          return tg.target === link.id ? _extends({}, tg, { label: link.label }) : tg;
        });
      } else {
        currentTarget.linksTo.add({
          target: link.id,
          label: link.label,
          edited: false
        });
      }
      _this3.props.setEntities(_this3.props.entities.map(function (entity) {
        return entity.id === currentTarget.id ? currentTarget : entity;
      }));
    }, _temp), _possibleConstructorReturn(_this3, _ret);
  }

  ArrowBodyContainer.prototype.render = function render() {
    var _this4 = this;

    return React.createElement(
      "g",
      null,
      this.props.links.map(function (link) {
        return link.points && React.createElement(ArrowBody, {
          key: link.target,
          id: link.target,
          label: link.label,
          points: pointsToString(link.points),
          edited: link.edited,
          handleSubmit: function handleSubmit(link) {
            return _this4.handleSubmit(link);
          }
        });
      })
    );
  };

  return ArrowBodyContainer;
}(React.PureComponent);
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


var mapStateToProps = function mapStateToProps(state) {
  return {
    entities: state.entity
  };
};
export default connect(mapStateToProps, {
  setEntities: setEntities
})(ArrowBodyContainer);
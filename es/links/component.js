var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteralLoose(["\n  fill: none;\n  stroke-width: .1em;\n  stroke: black;\n  stroke-linejoin: round;\n  marker-end: url(\"#arrow-end\");\n"], ["\n  fill: none;\n  stroke-width: .1em;\n  stroke: black;\n  stroke-linejoin: round;\n  marker-end: url(\"#arrow-end\");\n"]),
    _templateObject2 = _taggedTemplateLiteralLoose(["\n  fill: none;\n  stroke-width: 1em;\n  stroke: transparent;\n  stroke-linejoin: round;\n"], ["\n  fill: none;\n  stroke-width: 1em;\n  stroke: transparent;\n  stroke-linejoin: round;\n"]);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

import React from "react";
import style from "styled-components";

import { setModel } from "../entity/reducer";
import { Select, Button, Input } from "antd";
import { connect } from "react-redux";
import calcLinkPoints from "./calcLinkPoints";
import { State } from "../diagram/reducer";
import { store as diagramStore } from "../diagram/component";
/*
 * Presentational
 * ==================================== */

var Line = style.path(_templateObject);

var InteractionLine = style.path(_templateObject2);
var Option = Select.Option;

var Options = ["1...1", "1...n", "n...n"];

var SelectAfter = function SelectAfter(props) {
  return React.createElement(
    "div",
    null,
    props.hasUnderLabel && React.createElement(Input, {
      placeholder: "relationName",
      value: props.inputValue,
      onChange: props.handleInputValueChange,
      onPressEnter: props.handleInputValueChange
    }),
    React.createElement(
      Select,
      {
        placeholder: "\u8BF7\u9009\u62E9\u6A21\u578B\u5173\u7CFB",
        defaultValue: props.value ? props.value : "1..1",
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
    ),
    React.createElement(Button, { icon: "delete", onClick: function onClick() {
        return props.handleDelete();
      } })
  );
};

var ArrowBody = function (_React$Component) {
  _inherits(ArrowBody, _React$Component);

  function ArrowBody(props) {
    _classCallCheck(this, ArrowBody);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      label: props.label,
      edited: props.edited,
      underLabel: props.underLabel ? props.underLabel : ""
    };
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleSelect = _this.handleSelect.bind(_this);
    _this.handleDelete = _this.handleDelete.bind(_this);
    _this.handleInputValueChange = _this.handleInputValueChange.bind(_this);
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

  ArrowBody.prototype.handleClick = function handleClick() {
    this.setState({
      edited: true
    });
  };

  ArrowBody.prototype.handleSelect = function handleSelect(select) {
    this.setState({ label: select, edited: false });
    this.props.handleSubmit({
      id: this.props.id,
      underLabel: this.state.underLabel,
      label: select
    });
  };

  ArrowBody.prototype.handleDelete = function handleDelete() {
    this.props.handleDelete();
  };

  ArrowBody.prototype.handleInputValueChange = function handleInputValueChange(ev) {
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
  };

  ArrowBody.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        points = _props.points,
        id = _props.id,
        from = _props.from;

    var pointsStr = pointsToString(points);
    var _state = this.state,
        label = _state.label,
        underLabel = _state.underLabel;

    var newId = "From" + from + "To" + id;
    var notEdited = React.createElement(
      "g",
      { ref: function ref(_ref) {
          return _this2.polyline = _ref;
        } },
      React.createElement(Line, { d: pointsStr, id: "line" + newId }),
      React.createElement(InteractionLine, { d: pointsStr }),
      label && React.createElement(
        "text",
        { dy: ".8rem" },
        React.createElement(
          "textPath",
          {
            xlinkHref: "#line" + newId,
            startOffset: "33%",
            style: { fontSize: ".8rem" }
          },
          label
        )
      ),
      underLabel && React.createElement(
        "text",
        { dy: "-.25rem" },
        React.createElement(
          "textPath",
          {
            xlinkHref: "#line" + newId,
            startOffset: "33%",
            style: { fontSize: ".8rem", fontWeight: "bold" }
          },
          underLabel
        )
      )
    );
    var start = points[0];
    var end = points[1];
    var editedMode = React.createElement(
      "g",
      null,
      React.createElement(Line, { d: pointsStr, id: "line" + newId }),
      React.createElement(InteractionLine, { d: pointsStr }),
      React.createElement(
        "foreignObject",
        {
          width: "100",
          height: "100",
          x: (Number(start.x) + Number(end.x)) / 2 - 50,
          y: (Number(start.y) + Number(end.y)) / 2
        },
        React.createElement(SelectAfter, {
          value: label,
          handleSelect: this.handleSelect,
          handleDelete: function handleDelete() {
            return _this2.handleDelete();
          },
          hasUnderLabel: typeof underLabel !== 'undefined',
          inputValue: underLabel,
          handleInputValueChange: this.handleInputValueChange
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
      var currentIndex = _this3.props.entities.findIndex(function (entity) {
        return entity.id === _this3.props.from;
      });
      var currentTarget = _extends({}, _this3.props.entities[currentIndex]);
      var label = link.label,
          underLabel = link.underLabel;

      var isExist = currentTarget.linksTo.find(function (lk) {
        return lk.target === link.id;
      });
      if (currentTarget.linksTo && isExist) {
        currentTarget.linksTo = currentTarget.linksTo.map(function (tg) {
          return tg.target === link.id ? _extends({}, tg, { label: label, custom: { underLabel: underLabel } }) : tg;
        });
      } else {
        currentTarget.linksTo = [].concat(currentTarget.linksTo, [{
          target: link.id,
          label: label,
          custom: { underLabel: underLabel },
          edited: false
        }]);
      }
      _this3.props.setModel(currentTarget);
    }, _temp), _possibleConstructorReturn(_this3, _ret);
  }

  ArrowBodyContainer.prototype.handleDelete = function handleDelete(target) {
    var _this4 = this;

    var currentTarget = this.props.entities.find(function (et) {
      return et.id === _this4.props.from;
    });
    var linkIndex = currentTarget.linksTo.findIndex(function (lk) {
      return lk.target === target;
    });
    if (linkIndex >= 0) {
      currentTarget.linksTo.splice(linkIndex, 1);
    }
    this.props.setModel(currentTarget);
  };

  ArrowBodyContainer.prototype.render = function render() {
    var _this5 = this;

    return React.createElement(
      "g",
      null,
      this.props.links.map(function (link) {
        return link.points && React.createElement(ArrowBody, {
          key: link.target,
          id: link.target,
          from: _this5.props.from,
          label: link.label,
          underLabel: link.custom && link.custom.underLabel ? link.custom.underLabel : "",
          points: link.points,
          edited: link.edited,
          handleSubmit: function handleSubmit(link) {
            return _this5.handleSubmit(link);
          },
          handleDelete: function handleDelete() {
            return _this5.handleDelete(link.target);
          }
        });
      })
    );
  };

  return ArrowBodyContainer;
}(React.PureComponent);

var mapStateToProps = function mapStateToProps(state) {
  return {
    entities: state.entity
  };
};
export default connect(mapStateToProps, {
  setModel: setModel
})(ArrowBodyContainer);
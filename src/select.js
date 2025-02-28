import React from "react";
import PropTypes from "prop-types";
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Option = require("./option");
const Items = require("./items");

const window = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    borderColor: "#BDBDC1",
    borderWidth: 2 / window.scale
  }
});

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.pageX = 0;
    this.pageY = 0;

    this.state = {
      value: this.props.initKey
        ? this.props.data.filter(item => item.key === this.props.initKey)[0]
          .label
        : this.props.placeholder,
      show_options: false,
      search_text: ""
    };
  }

  _reset() {
    const { placeholder } = this.props;
    this.setState({ value: placeholder, show_options: false, search_text: "" });
    this.props.onSelect(null, null);
    if (this.props.parentScrollEnable) {
      this.props.parentScrollEnable();
    }
  }

  _onPress() {
    this._select.measure((width, height, px, py, fx, fy) => {
      const location = {
        fx: fx,
        fy: this.state.show_options ? Dimensions.get("window").height * 0.30 : 0,
        px: px,
        py: py,
        width: width,
        height: height
      };
      this.setState({ location });
    });
    if (this.state.show_options) {
      this.setState({ show_options: false, search_text: "" });
    } else {
      this.setState({ show_options: true });
      if (this.props.parentScrollDisable) {
        this.props.parentScrollDisable();
      }
    }

  }

  _handleSelect(key, label) {
    this.setState({ show_options: false, value: label, search_text: "" });
    this.props.onSelect(key, label);
    if (this.props.parentScrollEnable) {
      this.props.parentScrollEnable();
    }
  }

  _onChangeInput(text) {
    this.setState({ search_text: text });
  }

  _handleOptionsClose() {
    this.setState({
      show_options: false,
      search_text: ""
    });
    if (this.props.parentScrollEnable) {
      this.props.parentScrollEnable();
    }
  }

  render() {
    const {
      width,
      height,
      data,
      style,
      styleOption,
      styleText,
      search
    } = this.props;
    const dimensions = { width, height };
    return (


      <View style={{ marginTop: this.state.show_options ? 0 : Dimensions.get("window").height * 0.13 }}>
        {this.state.show_options &&
          <View style={{
            alignSelf: 'center',
            width: Dimensions.get("window").width,
            marginTop: Dimensions.get("window").width * -0.99,
            height: Dimensions.get("window").height * 1.1,
            backgroundColor: 'black',
            opacity: 0.85
          }} />
        }
        <View
          ref={ref => {
            this._select = ref;
          }}
          style={[
            styles.container,
            style,
            dimensions,
            { flexDirection: "row", justifyContent: "space-between" }
          ]}
        >
          {!this.state.show_options && (
            <TouchableWithoutFeedback onPress={this._onPress.bind(this)}>
              <View
                style={{
                  flex: 3
                }}
              >
                <Option style={styleOption} styleText={styleText}>
                  {this.state.value}
                </Option>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
        {this.state.show_options && (
          <Items
            items={data.filter(item => {
              const parts = this.state.search_text.trim().split(/[ \-:]+/);
              const regex = new RegExp(`(${parts.join("|")})`, "ig");
              return regex.test(item.label);
            })}
            show={this.state.show_options}
            width={width}
            height={height}
            location={this.state.location}
            onPress={this._handleSelect.bind(this)}
            handleClose={this._handleOptionsClose.bind(this)}
            onChangeText={this._onChangeInput.bind(this)}
            placeholder={this.props.searchPlaceholder}
          />
        )}
      </View>
    );
  }
}

Select.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  onSelect: PropTypes.func,
  search: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  initKey: PropTypes.number
};

Select.defaultProps = {
  width: 200,
  height: 40,
  onSelect: () => { },
  search: true,
  initKey: 0,
  placeholder: "Select",
  searchPlaceholder: "Search"
};

module.exports = Select;

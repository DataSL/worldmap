import * as React from "react";

import { formatNumber } from "../../utils/helpers";

export interface State {
  colors?: string[];
  values?: number[];
  valueDecimalPlaces?: number;
  displayUnits?: number;
  valueFormat?: string;
}

export const initialState: State = {
  colors: [],
  values: [],
  valueDecimalPlaces: 2,
  displayUnits: 0,
  valueFormat: "",
};

export class Scale extends React.Component<Record<string, never>, State> {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    if (typeof Scale.updateCallback === "function") {
      Scale.updateCallback(newState);
    }
  }

  public state: State = initialState;

  public componentWillMount() {
    Scale.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "28px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "14px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {this.state.colors.map((color, index) =>
            index < this.state.colors.length - 1 ? (
              <div
                style={{
                  width: "50px",
                  height: "14px",
                  borderRight: ".8px solid #555",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "7px",
                    backgroundColor: color,
                  }}
                ></div>
              </div>
            ) : (
              <div
                style={{
                  width: "50px",
                  height: "14px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "7px",
                    backgroundColor: color,
                  }}
                ></div>
              </div>
            )
          )}
        </div>
        <div
          style={{
            width: "100%",
            height: "14px",
            display: "flex",
            flexDirection: "row",
            fontSize: "12px",
          }}
        >
          {this.state.values.map((value, index) =>
            index === 0 ? (
              <div
                style={{
                  width: "50px",
                  height: "14px",
                  marginLeft: "24px",
                  textAlign: "center",
                }}
              >
                {formatNumber(
                  value,
                  this.state.valueDecimalPlaces,
                  this.state.displayUnits,
                  this.state.valueFormat
                )}
              </div>
            ) : (
              <div
                style={{ width: "50px", height: "14px", textAlign: "center" }}
              >
                {formatNumber(
                  value,
                  this.state.valueDecimalPlaces,
                  this.state.displayUnits,
                  this.state.valueFormat
                )}
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

export default Scale;

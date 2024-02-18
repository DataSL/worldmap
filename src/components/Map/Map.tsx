import * as React from "react";
import { VectorMap } from "@react-jvectormap/core";

import { paths } from "../../assets/paths";
import { Scale } from "../Scale/Scale";
import * as d3 from "d3";
import { Country } from "../../visual";
import { formatNumber } from "../../utils/helpers";

export interface State {
  countries: { [code: string]: Country };
  mapValues?: { [country: string]: number };
  scaleValues?: any;
  displayUnits?: number;
  valueDecimalPlaces?: number;
  valueFormats?: { [key: string]: string };
  displayScaleLegend: boolean;
  countryBordersColor?: string;
  lowestValueColor?: string;
  highestValueColor?: string;
  backgroundColor?: string;
  noValueColor?: string;
  horizontalPadding?: number;
  verticalPadding?: number;
  separatorColor?: string;
  titleFontFamily?: string;
  titleFontSize?: number;
  titleBold?: boolean;
  titleItalic?: boolean;
  titleUnderline?: boolean;
  titleColor?: string;
  mainValueFontFamily?: string;
  mainValueFontSize?: number;
  mainValueBold?: boolean;
  mainValueItalic?: boolean;
  mainValueUnderline?: boolean;
  mainValueColor?: string;
  secondaryValuesFontFamily?: string;
  secondaryValuesFontSize?: number;
  secondaryValuesBold?: boolean;
  secondaryValuesItalic?: boolean;
  secondaryValuesUnderline?: boolean;
  secondaryValuesColor?: string;
  mapRef?: React.MutableRefObject<any>;
}

export const initialState: State = {
  countries: {},
  mapValues: {},
  scaleValues: null,
  displayUnits: 0,
  valueDecimalPlaces: 2,
  valueFormats: {},
  displayScaleLegend: true,
  countryBordersColor: "#ffffff",
  lowestValueColor: "#feebe2",
  highestValueColor: "#48001e",
  backgroundColor: "#ffffff",
  noValueColor: "#808080",
  horizontalPadding: 10,
  verticalPadding: 10,
  separatorColor: "#000000",
  titleFontFamily: "Arial",
  titleFontSize: 16,
  titleBold: false,
  titleItalic: false,
  titleUnderline: false,
  titleColor: "#000000",
  mainValueFontFamily: "Arial",
  mainValueFontSize: 14,
  mainValueBold: false,
  mainValueItalic: false,
  mainValueUnderline: false,
  mainValueColor: "#000000",
  secondaryValuesFontFamily: "Arial",
  secondaryValuesFontSize: 12,
  secondaryValuesBold: false,
  secondaryValuesItalic: false,
  secondaryValuesUnderline: false,
  secondaryValuesColor: "#000000",
  mapRef: null,
};

export class Map extends React.Component<Record<string, never>, State> {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleOnRegionTipShow = this.handleOnRegionTipShow.bind(this);
    this.state.mapRef = React.createRef();
  }

  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    if (typeof Map.updateCallback === "function") {
      Map.updateCallback(newState);
    }
  }

  public state: State = initialState;

  public componentWillMount() {
    Map.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    Map.updateCallback = null;
  }

  public componentDidUpdate(): void {
    // Tooltip bug
    Array.from(document.getElementsByClassName("jvectormap-tip")).forEach(
      (el) => {
        const htmlElement = el as HTMLElement;
        htmlElement.style.display = "none";
      }
    );

    const valueFormat = "";

    Scale.update({
      colors: this.getScaleColors(),
      values: this.getScaleValues(),
      displayUnits: this.state.displayUnits,
      valueDecimalPlaces: this.state.valueDecimalPlaces,
      valueFormat,
    });
  }

  setOtherValueElements(country, el) {
    Object.keys(country.otherValues).forEach((key) => {
      const otherValueElement = document.createElement("div");
      otherValueElement.classList.add("otherValue");

      otherValueElement.style.color = this.state.secondaryValuesColor;
      otherValueElement.style.fontFamily = this.state.secondaryValuesFontFamily;
      otherValueElement.style.fontSize =
        this.state.secondaryValuesFontSize.toString() + "px";
      this.state.secondaryValuesBold
        ? (otherValueElement.style.fontWeight = "bold")
        : (otherValueElement.style.fontWeight = "normal");
      this.state.secondaryValuesItalic
        ? (otherValueElement.style.fontStyle = "italic")
        : (otherValueElement.style.fontStyle = "normal");
      this.state.secondaryValuesUnderline
        ? (otherValueElement.style.textDecoration = "underline")
        : (otherValueElement.style.textDecoration = "normal");

      const otherValueFormat = this.state.valueFormats[key]
        ? this.state.valueFormats[key]
        : "";

      const otherValueElementTitle = document.createElement("span");
      otherValueElementTitle.append(key + ": ");

      const otherValueElementValue = document.createElement("span");
      country &&
        otherValueElementValue.append(
          formatNumber(
            country.otherValues[key],
            this.state.valueDecimalPlaces,
            this.state.displayUnits,
            otherValueFormat
          )
        );
      otherValueElementValue.style.fontWeight = "bold";

      otherValueElement.append(otherValueElementTitle, otherValueElementValue);

      el[0].append(otherValueElement);
    });
  }

  handleOnRegionTipShow(e, el, code) {
    const country = this.state.countries[code];

    el[0].classList.add("tooltip");

    el[0].style.paddingTop = this.state.verticalPadding + "px";
    el[0].style.paddingBottom = this.state.verticalPadding + "px";
    el[0].style.paddingLeft = this.state.horizontalPadding + "px";
    el[0].style.paddingRight = this.state.horizontalPadding + "px";

    el[0].style.transform =
      "translate(-" +
      this.state.verticalPadding * 2 +
      "px, -" +
      this.state.horizontalPadding * 2 +
      "px)";

    const countryNameElement = document.createElement("div");
    countryNameElement.classList.add("title");

    countryNameElement.style.color = this.state.titleColor;
    countryNameElement.style.fontFamily = this.state.titleFontFamily;
    countryNameElement.style.fontSize =
      this.state.titleFontSize.toString() + "px";
    this.state.titleBold
      ? (countryNameElement.style.fontWeight = "bold")
      : (countryNameElement.style.fontWeight = "normal");
    this.state.titleItalic
      ? (countryNameElement.style.fontStyle = "italic")
      : (countryNameElement.style.fontStyle = "normal");
    this.state.titleUnderline
      ? (countryNameElement.style.textDecoration = "underline")
      : (countryNameElement.style.textDecoration = "normal");

    countryNameElement.append(paths[code]["name"]);

    el[0].replaceChildren(countryNameElement);

    const titleSeparator = document.createElement("hr");
    titleSeparator.style.backgroundColor = this.state.separatorColor;

    el[0].append(titleSeparator);

    const mainValueElement = document.createElement("div");
    mainValueElement.classList.add("value");

    mainValueElement.style.color = this.state.mainValueColor;
    mainValueElement.style.fontFamily = this.state.mainValueFontFamily;
    mainValueElement.style.fontSize =
      this.state.mainValueFontSize.toString() + "px";
    this.state.mainValueBold
      ? (mainValueElement.style.fontWeight = "bold")
      : (mainValueElement.style.fontWeight = "normal");
    this.state.mainValueItalic
      ? (mainValueElement.style.fontStyle = "italic")
      : (mainValueElement.style.fontStyle = "normal");
    this.state.mainValueUnderline
      ? (mainValueElement.style.textDecoration = "underline")
      : (mainValueElement.style.textDecoration = "normal");

    if (country) {
      const mainValueKey = Object.keys(country.mainValue)[0];
      const mainValueFormat = this.state.valueFormats[mainValueKey]
        ? this.state.valueFormats[mainValueKey]
        : "";
      const mainValueElementTitle = document.createElement("span");
      mainValueElementTitle.append(mainValueKey + ": ");

      const mainValueElementValue = document.createElement("span");
      mainValueElementValue.append(
        formatNumber(
          country.mainValue[mainValueKey],
          this.state.valueDecimalPlaces,
          this.state.displayUnits,
          mainValueFormat
        )
      );
      mainValueElementValue.style.fontWeight = "bold";

      mainValueElement.append(mainValueElementTitle, mainValueElementValue);

      el[0].append(mainValueElement);

      const mainValueSeparator = document.createElement("hr");
      mainValueSeparator.style.backgroundColor = this.state.separatorColor;
      el[0].append(mainValueSeparator);

      if (country) {
        this.setOtherValueElements(country, el);
      }
    } else {
      const noValueElement = document.createElement("span");
      noValueElement.append("No value");

      mainValueElement.append(noValueElement);

      el[0].append(mainValueElement);
    }
  }

  getScaleValues() {
    const array = [];
    for (const key in this.state.mapValues) {
      let value = this.state.mapValues[key];
      const mainValueKey = Object.keys(this.state.countries[key].mainValue)[0];

      if (this.state.valueFormats[mainValueKey] === "%") value = value * 100;

      array.push(value);
    }

    const max = Math.max(...array);

    return [
      Math.round((1 / 5) * max),
      Math.round((2 / 5) * max),
      Math.round((3 / 5) * max),
      Math.round((4 / 5) * max),
    ];
  }

  getScaleColors() {
    const array = [];
    for (const key in this.state.mapValues) {
      let value = this.state.mapValues[key];
      const mainValueKey = Object.keys(this.state.countries[key].mainValue)[0];

      if (this.state.valueFormats[mainValueKey] === "%") value = value * 100;

      array.push(value);
    }

    const min = Math.min(...array);
    const max = Math.max(...array);

    const scaleValues = this.getScaleValues();
    scaleValues.unshift(min);

    const colorScale = d3
      .scaleLinear<string, number>()
      .range([this.state.lowestValueColor, this.state.highestValueColor])
      .domain([min, max]);

    return scaleValues.map((value) => colorScale(value).toString());
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <>
          {Object.keys(this.state.mapValues).length > 0 && (
            <>
              {this.state.displayScaleLegend && <Scale />}
              <div style={{ width: "100%", height: "calc(100% - 28px)" }}>
                <VectorMap
                  zoomAnimate={false}
                  zoomOnScroll={false}
                  map={{
                    content: {
                      height: 583.0802520919394,
                      insets: [
                        {
                          bbox: [
                            {
                              x: -20004297.151525836,
                              y: -18449355.69035302,
                            },
                            {
                              x: 20026572.394749384,
                              y: 7485321.539093307,
                            },
                          ],
                          height: 583.0802520919394,
                          left: 0,
                          top: 0,
                          width: 900,
                        },
                      ],
                      paths: paths,
                      projection: {
                        centralMeridian: 11.5,
                        type: "merc",
                      },
                      width: 900,
                    },
                    name: "world_merc",
                  }}
                  backgroundColor={this.state.backgroundColor}
                  mapRef={this.state.mapRef}
                  onRegionTipShow={this.handleOnRegionTipShow}
                  regionStyle={{
                    initial: {
                      fill: this.state.noValueColor,
                      strokeWidth: 1,
                      strokeOpacity: 1,
                      stroke: this.state.countryBordersColor,
                    },
                  }}
                  series={{
                    regions: [
                      {
                        attribute: "",
                        normalizeFunction: "linear",
                        scale: this.state.scaleValues,
                        values: this.state.mapValues,
                      },
                    ],
                  }}
                  selectedRegions={[]}
                />
              </div>
            </>
          )}
        </>
      </div>
    );
  }
}

export default Map;

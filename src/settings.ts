/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class MapColorsCardSettings extends FormattingSettingsCard {
  countryBordersColor = new formattingSettings.ColorPicker({
    name: "countryBordersColor",
    displayName: "Country borders color",
    description: "The fill color of the country borders",
    value: { value: "#ffffff" },
  });

  lowestValueColor = new formattingSettings.ColorPicker({
    name: "lowestValueColor",
    displayName: "Lowest value color",
    description: "The fill color of the lowest value",
    value: { value: "#feebe2" },
  });

  highestValueColor = new formattingSettings.ColorPicker({
    name: "highestValueColor",
    displayName: "Highest value color",
    description: "The fill color of the highest value",
    value: { value: "#48001e" },
  });

  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Background color",
    description: "The fill color of the background",
    value: { value: "#ffffff" },
  });

  noValueColor = new formattingSettings.ColorPicker({
    name: "noValueColor",
    displayName: "No Value color",
    description: "The fill color for countries with no value",
    value: { value: "#808080" },
  });

  name: string = "mapColors";
  displayName: string = "Map colors";
  slices: Array<FormattingSettingsSlice> = [
    this.countryBordersColor,
    this.lowestValueColor,
    this.highestValueColor,
    this.backgroundColor,
    this.noValueColor,
  ];
}

/* class CountriesCardSettings extends FormattingSettingsCard {
  name: string = "countries";
  displayName: string = "Countries";
  slices: Array<FormattingSettingsSlice> = [];
} */

class TooltipFontCardSettings extends FormattingSettingsCard {
  displayUnits = new formattingSettings.AutoDropdown({
    name: "displayUnits",
    displayName: "Display units",
    value: 0,
  });

  valueDecimalPlaces = new formattingSettings.NumUpDown({
    name: "valueDecimalPlaces",
    displayName: "Value decimal places",
    value: 2,
  });

  horizontalPadding = new formattingSettings.NumUpDown({
    name: "horizontalPadding",
    displayName: "Horizontal padding",
    description: "The horizontal padding of the tooltip",
    value: 10,
  });

  verticalPadding = new formattingSettings.NumUpDown({
    name: "verticalPadding",
    displayName: "Vertical padding",
    description: "The vertical padding of the tooltip",
    value: 10,
  });

  separatorColor = new formattingSettings.ColorPicker({
    name: "separatorColor",
    displayName: "Separator color",
    description: "The fill color of the separator",
    value: { value: "#000000" },
  });

  /* TITLE */
  titleFontFamily = new formattingSettings.FontPicker({
    name: "titleFontFamily",
    value: "Arial",
  });

  titleFontSize = new formattingSettings.NumUpDown({
    name: "titleFontSize",
    value: 12,
  });

  titleBold = new formattingSettings.ToggleSwitch({
    name: "titleBold",
    value: false,
  });

  titleItalic = new formattingSettings.ToggleSwitch({
    name: "titleItalic",
    value: false,
  });

  titleUnderline = new formattingSettings.ToggleSwitch({
    name: "titleUnderline",
    value: false,
  });

  titleFontControl = new formattingSettings.FontControl({
    name: "titleFontControl",
    displayName: "Title font",
    fontFamily: this.titleFontFamily,
    fontSize: this.titleFontSize,
    bold: this.titleBold,
    italic: this.titleItalic,
    underline: this.titleUnderline,
  });

  titleColor = new formattingSettings.ColorPicker({
    name: "titleColor",
    displayName: "Title color",
    description: "The fill color of the title",
    value: { value: "#000000" },
  });

  /* MAIN VALUE */
  mainValueFontFamily = new formattingSettings.FontPicker({
    name: "mainValueFontFamily",
    value: "Arial",
  });

  mainValueFontSize = new formattingSettings.NumUpDown({
    name: "mainValueFontSize",
    value: 12,
  });

  mainValueBold = new formattingSettings.ToggleSwitch({
    name: "mainValueBold",
    value: false,
  });

  mainValueItalic = new formattingSettings.ToggleSwitch({
    name: "mainValueItalic",
    value: false,
  });

  mainValueUnderline = new formattingSettings.ToggleSwitch({
    name: "mainValueUnderline",
    value: false,
  });

  mainValueFontControl = new formattingSettings.FontControl({
    name: "mainValueFontControl",
    displayName: "Main value font",
    fontFamily: this.mainValueFontFamily,
    fontSize: this.mainValueFontSize,
    bold: this.mainValueBold,
    italic: this.mainValueItalic,
    underline: this.mainValueUnderline,
  });

  mainValueColor = new formattingSettings.ColorPicker({
    name: "mainValueColor",
    displayName: "Main value color",
    description: "The fill color of the main value",
    value: { value: "#000000" },
  });

  /* SECONDAY VALUES */
  secondaryValuesFontFamily = new formattingSettings.FontPicker({
    name: "secondaryValuesFontFamily",
    value: "Arial",
  });

  secondaryValuesFontSize = new formattingSettings.NumUpDown({
    name: "secondaryValuesFontSize",
    value: 12,
  });

  secondaryValuesBold = new formattingSettings.ToggleSwitch({
    name: "secondaryValuesBold",
    value: false,
  });

  secondaryValuesItalic = new formattingSettings.ToggleSwitch({
    name: "secondaryValuesItalic",
    value: false,
  });

  secondaryValuesUnderline = new formattingSettings.ToggleSwitch({
    name: "secondaryValuesUnderline",
    value: false,
  });

  secondaryValuesFontControl = new formattingSettings.FontControl({
    name: "secondaryValuesFontControl",
    displayName: "Secondary values font",
    fontFamily: this.secondaryValuesFontFamily,
    fontSize: this.secondaryValuesFontSize,
    bold: this.secondaryValuesBold,
    italic: this.secondaryValuesItalic,
    underline: this.secondaryValuesUnderline,
  });

  secondaryValuesColor = new formattingSettings.ColorPicker({
    name: "secondaryValuesColor",
    displayName: "Secondary values color",
    description: "The fill color of the secondary values",
    value: { value: "#000000" },
  });

  name: string = "tooltip";
  displayName: string = "Tooltip";
  slices: Array<FormattingSettingsSlice> = [
    this.displayUnits,
    this.valueDecimalPlaces,
    this.horizontalPadding,
    this.verticalPadding,
    this.separatorColor,
    this.titleFontControl,
    this.titleColor,
    this.mainValueFontControl,
    this.mainValueColor,
    this.secondaryValuesFontControl,
    this.secondaryValuesColor,
  ];
}

class CategoryColorsCardSettings extends FormattingSettingsCard {
  useCategory = new formattingSettings.ToggleSwitch({
    name: "useCategory",
    displayName: "Use category",
    description: "Use or not the category data for the map",
    value: false,
  });

  name: string = "category";
  displayName: string = "Category";
  slices: Array<FormattingSettingsSlice> = [this.useCategory];
}

/**
 * visual settings model class
 *
 */
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
  mapColorsCard = new MapColorsCardSettings();
  //countriesCard = new CountriesCardSettings();
  categoryColorsCard = new CategoryColorsCardSettings();
  tooltipCard = new TooltipFontCardSettings();
  cards = [
    this.mapColorsCard,
    //this.countriesCard,
    this.tooltipCard,
    this.categoryColorsCard,
  ];
}

/*
 *  Power BI Visual CLI
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
import "core-js/stable";
import * as React from "react";
import * as ReactDOM from "react-dom";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import ISelectionId = powerbi.visuals.ISelectionId;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import ISandboxExtendedColorPalette = powerbi.extensibility.ISandboxExtendedColorPalette;
import Fill = powerbi.Fill;
import IVisualEventService = powerbi.extensibility.IVisualEventService;

import Map, { initialState } from "./components/Map/Map";
import "regenerator-runtime/runtime";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { getCategoricalObjectValue } from "./objectEnumerationUtility";

import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";
import IPromise = powerbi.IPromise;

//import LicenseInfoResult = powerbi.extensibility.visual.LicenseInfoResult;

export interface Country {
  mainValue: { [key: string]: number };
  otherValues: { [key: string]: number };
  category: string;
  categoryValue: number;
}

export interface IVisualLicenseManager {
  getAvailableServicePlans(): IPromise<powerbi.extensibility.visual.LicenseInfoResult>;
}

export class Visual implements IVisual {
  private target: HTMLElement;
  private reactRoot: React.ComponentElement<any, any>;
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  private host;
  private events: IVisualEventService;
  private licenseManager: IVisualLicenseManager;
  private notificationType;
  private hasServicePlans;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(Map, {});
    this.target = options.element;
    this.formattingSettingsService = new FormattingSettingsService();
    this.host = options.host;
    this.events = options.host.eventService;

    /*this.licenseManager = options.host.licenseManager;

    this.licenseManager
      .getAvailableServicePlans()
      .then((result: LicenseInfoResult) => {
        this.notificationType = result.isLicenseUnsupportedEnv
          ? powerbi.LicenseNotificationType.UnsupportedEnv
          : powerbi.LicenseNotificationType.General;
        this.hasServicePlans = !!(
          result.plans &&
          result.plans.length &&
          result.plans[0].spIdentifier ==
            "test_isvconnect1599092224747.powerbivisualtransact.plan1" &&
          (result.plans[0].state == powerbi.ServicePlanState.Active ||
            result.plans[0].state == powerbi.ServicePlanState.Warning)
        );

        // display notification if the user doesn't have licenses
        if (!this.hasServicePlans) {
          ReactDOM.render(
            React.createElement("div", null, "You have to purchase a licence"),
            this.target
          );
        } else {
          ReactDOM.render(this.reactRoot, this.target);
        }
      })
      .catch((err) => {
        this.hasServicePlans = undefined;
        console.log(err);
      });*/
    ReactDOM.render(this.reactRoot, this.target);
  }

  updateMap(
    countries,
    mapValues,
    scaleValues,
    displayScaleLegend,
    tooltipSettings,
    valueFormats,
    mapColorsSettings
  ) {
    Map.update({
      countries,
      mapValues,
      scaleValues,
      displayScaleLegend,
      displayUnits: parseInt(tooltipSettings.displayUnits.value.toString()),
      valueDecimalPlaces: tooltipSettings.valueDecimalPlaces.value,
      valueFormats: valueFormats,
      countryBordersColor: mapColorsSettings.countryBordersColor.value.value,
      lowestValueColor: mapColorsSettings.lowestValueColor.value.value,
      highestValueColor: mapColorsSettings.highestValueColor.value.value,
      backgroundColor: mapColorsSettings.backgroundColor.value.value,
      noValueColor: mapColorsSettings.noValueColor.value.value,
      horizontalPadding: tooltipSettings.horizontalPadding.value,
      verticalPadding: tooltipSettings.verticalPadding.value,
      separatorColor: tooltipSettings.separatorColor.value.value,
      titleFontFamily: tooltipSettings.titleFontFamily.value,
      titleFontSize: tooltipSettings.titleFontSize.value,
      titleBold: tooltipSettings.titleBold.value,
      titleItalic: tooltipSettings.titleItalic.value,
      titleUnderline: tooltipSettings.titleUnderline.value,
      titleColor: tooltipSettings.titleColor.value.value,
      mainValueFontFamily: tooltipSettings.mainValueFontFamily.value,
      mainValueFontSize: tooltipSettings.mainValueFontSize.value,
      mainValueBold: tooltipSettings.mainValueBold.value,
      mainValueItalic: tooltipSettings.mainValueItalic.value,
      mainValueUnderline: tooltipSettings.mainValueUnderline.value,
      mainValueColor: tooltipSettings.mainValueColor.value.value,
      secondaryValuesFontFamily:
        tooltipSettings.secondaryValuesFontFamily.value,
      secondaryValuesFontSize: tooltipSettings.secondaryValuesFontSize.value,
      secondaryValuesBold: tooltipSettings.secondaryValuesBold.value,
      secondaryValuesItalic: tooltipSettings.secondaryValuesItalic.value,
      secondaryValuesUnderline: tooltipSettings.secondaryValuesUnderline.value,
      secondaryValuesColor: tooltipSettings.secondaryValuesColor.value.value,
    });
  }

  setCategories(
    dataView,
    colorPalette,
    categoryColors,
    categoryColorsSettings
  ) {
    const categorical = dataView.categorical;
    const category = categorical.categories[0];

    const categories = dataView.categorical.categories[0].values;

    const countryCategories = Object.keys(categories).map((key) =>
      categories[key].toString()
    );
    const uniqueCountryCategories = countryCategories.filter(
      (v, i, a) => a.indexOf(v) === i
    );

    for (let i = 0; i < uniqueCountryCategories.length; i++) {
      const color: string = this.getColumnColorByIndex(
        category,
        i,
        colorPalette
      );

      const selectionId: ISelectionId = this.host
        .createSelectionIdBuilder()
        .withCategory(category, i)
        .createSelectionId();

      categoryColors.push({
        name: uniqueCountryCategories[i],
        color,
        selectionId,
      });
    }

    categoryColors.forEach((cc) => {
      categoryColorsSettings.slices.push(
        new formattingSettings.ColorPicker({
          name: "categoryColor",
          displayName: cc.name,
          description: cc.name,
          altConstantSelector: cc.selectionId.getSelector(),
          instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
          value: { value: cc.color },
        })
      );
    });
  }

  setValues(
    dataView,
    valueFormats,
    valueFormatsIndexes,
    categoryValues,
    countries
  ) {
    dataView.table.rows.forEach((row) => {
      let code;
      const mainValue = {};
      const otherValues = {};
      let category;
      let categoryValue;

      for (let i = 0; i < row.length; i++) {
        const cell = row[i];

        if (dataView.table.columns[i].roles.country) code = cell;

        if (dataView.table.columns[i].roles.value) {
          const valueDisplayName = dataView.table.columns[i].displayName;
          mainValue[valueDisplayName] = parseFloat(cell as string);

          if (valueFormatsIndexes[i]) {
            valueFormats[valueDisplayName] = valueFormatsIndexes[i];
          }
        }

        if (dataView.table.columns[i].roles.otherValues) {
          const valueDisplayName = dataView.table.columns[i].displayName;
          otherValues[valueDisplayName] = parseFloat(cell as string);

          if (valueFormatsIndexes[i]) {
            valueFormats[valueDisplayName] = valueFormatsIndexes[i];
          }
        }

        if (dataView.table.columns[i].roles.category) {
          category = cell as string;
          categoryValue = categoryValues[category];
        }
      }

      if (code) {
        const country: Country = {
          mainValue,
          otherValues,
          category,
          categoryValue,
        };
        countries[code] = country;
      }
    });
  }

  public update(options: VisualUpdateOptions) {
    this.events.renderingStarted(options);

    const colorPalette: ISandboxExtendedColorPalette = this.host.colorPalette;

    if (
      options.dataViews &&
      options.dataViews[0].table.columns.length > 0 &&
      options.dataViews[0].categorical.categories
    ) {
      const dataView: DataView = options.dataViews[0];
      this.formattingSettings =
        this.formattingSettingsService.populateFormattingSettingsModel(
          VisualFormattingSettingsModel,
          options.dataViews[0]
        );

      const mapColorsSettings = this.formattingSettings.mapColorsCard;
      const categoryColorsSettings = this.formattingSettings.categoryColorsCard;
      const tooltipSettings = this.formattingSettings.tooltipCard;

      const countries = {};
      const categoryColors = [];
      const valueFormatsIndexes = {};
      const valueFormats = {};

      // CATEGORIES
      this.setCategories(
        dataView,
        colorPalette,
        categoryColors,
        categoryColorsSettings
      );

      // Associate an integer value to a category, ex : Zone2 => 1
      const categoryValues = {};
      categoryColors.forEach((cc, i) => {
        categoryValues[cc.name] = i + 1;
      });

      // FORMATS
      dataView.table.columns.forEach((col) => {
        if (col.format) {
          if (col.format.includes("%")) {
            valueFormatsIndexes[col.index] = "%";
          } else if (col.format.includes("$")) {
            valueFormatsIndexes[col.index] = "$";
          } else if (col.format.includes("€")) {
            valueFormatsIndexes[col.index] = "€";
          }
        }
      });

      // VALUES
      this.setValues(
        dataView,
        valueFormats,
        valueFormatsIndexes,
        categoryValues,
        countries
      );

      if (countries && Object.keys(countries).length > 0) {
        const useCategory = categoryColorsSettings.useCategory.value;

        const mapValues = {};
        let scaleValues;
        let displayScaleLegend = true;

        if (useCategory) {
          displayScaleLegend = false;
          scaleValues = {};
          Object.keys(countries).forEach((key) => {
            const country = countries[key];
            mapValues[key] = country.categoryValue;
          });
          Object.keys(categoryValues).forEach((c) => {
            const cv = categoryValues[c];
            scaleValues[cv] = categoryColors[cv - 1].color;
          });
        } else {
          Object.keys(countries).forEach((key) => {
            const country = countries[key];
            const mainValueKey = Object.keys(country.mainValue)[0];
            const value = country.mainValue[mainValueKey];
            mapValues[key] = value;
          });
          scaleValues = [
            mapColorsSettings.lowestValueColor.value.value,
            mapColorsSettings.highestValueColor.value.value,
          ];
        }

        this.clear();
        this.updateMap(
          countries,
          mapValues,
          scaleValues,
          displayScaleLegend,
          tooltipSettings,
          valueFormats,
          mapColorsSettings
        );
      }
    } else {
      this.clear();
    }

    this.events.renderingFinished(options);
  }

  private clear() {
    Map.update(initialState);
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }

  private getColumnColorByIndex(
    category: DataViewCategoryColumn,
    index: number,
    colorPalette: ISandboxExtendedColorPalette
  ): string {
    if (colorPalette.isHighContrast) {
      return colorPalette.background.value;
    }

    const defaultColor: Fill = {
      solid: {
        color: colorPalette.getColor(`${category.values[index]}`).value,
      },
    };

    return getCategoricalObjectValue<Fill>(
      category,
      index,
      "category",
      "categoryColor",
      defaultColor
    ).solid.color;
  }
}

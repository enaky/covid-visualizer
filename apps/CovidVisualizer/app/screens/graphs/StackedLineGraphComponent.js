import React from "react";
import {Dimensions} from "react-native";
import {
    VictoryAxis,
    VictoryChart,
    VictoryLine, VictoryScatter,
    VictoryStack,
    VictoryTheme,
    VictoryGroup
} from "victory-native";
import BoxContainer from "../containers/BoxContainer";
import tableStyles from "../../config/tables/tablestyles";
import colorStyles from "../../config/colors";
import GraphTitle from "../containers/titles/GraphTitle";
import NumberFormatter from "../../services/NumberFormatterService";
import LoggerService from "../../services/LoggerService";

const styles = tableStyles;

export default class StackedLineGraphComponent extends React.Component {
    constructor(props) {
        LoggerService.formatLog("StackedLineGraphComponent", "Render method.");

        super(props);
        this.deaths = [
            {x: "Two days ago", y: this.props.data["twoDaysAgo"]["deaths"]},
            {x: "Yesterday", y: this.props.data["yesterday"]["deaths"]},
            {x: "Today", y: this.props.data["today"]["deaths"]}
        ];
        this.recovered = [
            {x: "Two days ago", y: this.props.data["twoDaysAgo"]["recovered"]},
            {x: "Yesterday", y: this.props.data["yesterday"]["recovered"]},
            {x: "Today", y: this.props.data["today"]["recovered"]}
        ];
        this.active = [
            {x: "Two days ago", y: this.props.data["twoDaysAgo"]["active"]},
            {x: "Yesterday", y: this.props.data["yesterday"]["active"]},
            {x: "Today", y: this.props.data["today"]["active"]}
        ];
        this.dataValues = [];
        for(let i = 0; i<3; ++i)
        {
            let inferiorLimit = Object.values(this.recovered[i])[1];
            this.dataValues.push(inferiorLimit);
            inferiorLimit = Object.values(this.active[i])[1]+inferiorLimit;
            this.dataValues.push(inferiorLimit);
            inferiorLimit = Object.values(this.deaths[i])[1]+ inferiorLimit;
            this.dataValues.push(inferiorLimit);
        }
        this.minValue = Math.min.apply(null, this.dataValues) -10000;
        this.maxValue = Math.max.apply(null, this.dataValues) +10000;
    }
    render() {
        LoggerService.formatLog(this.constructor.name, "Render method.");
        return (
            <BoxContainer>
                <GraphTitle text={"Last 3 days overall statistics"}/>
                <VictoryChart
                    theme={VictoryTheme.material}
                    domain={{y:[this.minValue, this.maxValue]}}
                    domainPadding={1}
                    standalone={true}
                    style={styles.tableStyle}
                    padding={styles.chartPadding}
                    height={Dimensions.get('window').height/2}
                    width={Dimensions.get('window').width}
                >
                    <VictoryAxis
                        fixLabelOverlap={true}
                        standalone={false}
                        style={{
                            tickLabels: tableStyles.tableTicksXStyle
                        }}
                    />
                    <VictoryAxis
                        dependentAxis={true}
                        tickFormat={(x) => {return NumberFormatter.numberAbbreviation(x);}}
                        style={{
                            tickLabels: tableStyles.tableTicksYStyle
                        }}
                    />
                    <VictoryStack
                    >
                        <VictoryGroup>
                            <VictoryLine
                                data={this.recovered}
                                style={{
                                    data: { stroke: colorStyles.graphColors.recoveredColor }
                                }}
                            />
                            <VictoryScatter
                                style={{ data: { fill: "black" } }}
                                size={3}
                                data={this.recovered}
                            />
                        </VictoryGroup>
                        <VictoryGroup>
                            <VictoryLine
                                data={this.active}
                                style={{
                                    data: { stroke: colorStyles.graphColors.activeColor }
                                }}
                            />
                            <VictoryScatter
                                style={{ data: { fill: "black" } }}
                                size={3}
                                data={this.active}
                            />
                        </VictoryGroup>
                        <VictoryGroup>
                            <VictoryLine
                                data={this.deaths}
                                style={{
                                    data: { stroke: colorStyles.graphColors.deathsColor }
                                }}
                            />
                            <VictoryScatter
                                style={{ data: { fill: "black" } }}
                                size={3}
                                data={this.active}
                            />
                        </VictoryGroup>
                    </VictoryStack>
                </VictoryChart>
            </BoxContainer>
        );
    }
}



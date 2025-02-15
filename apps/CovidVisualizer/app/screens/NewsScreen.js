import React from 'react';

import {
    ActivityIndicator,
    FlatList,
    Switch,
    View,
    Text
} from 'react-native'
import { Title } from 'react-native-paper';
import ConnectorService from "../services/ConnectorService";
import NewsCardContainer from './containers/NewsCardContainer';
import LoggerService from "../services/LoggerService";
import LoadDataService from "../services/LoadDataService";
import textStyles from "../config/styles/textstyles";
import containerStyles from "../config/styles/containerstyles";


class NewsScreen extends React.Component {
    constructor(props) {
        LoggerService.formatLog("NewsScreen", "Constructor.");
        super(props);
        this.state = {
            loadingData: true,
            refreshing: true,
            isEnglishEnabled: true
        };
        this.data = { 'articles': [] };
    }

    async componentDidMount() {
        LoggerService.formatLog(this.constructor.name, "componentDidMount method.");
        this.fetchNewsWithStorage().then((r) => { });
    }

    async fetchNewsWithStorage() {
        if (!this.state.isEnglishEnabled) {
            LoggerService.formatLog(this.constructor.name, "Fetch Romania news.");
            this.data = await LoadDataService.getData("RomaniaNews", ConnectorService.getRomaniaCovidNews);
        } else {
            LoggerService.formatLog(this.constructor.name, "Fetch World news.");
            this.data = await LoadDataService.getData("WorldNews", ConnectorService.getWorldCovidNews)
        }
        this.setState({ loadingData: false, refreshing: false });
    }

    async fetchNews() {
        if (!this.state.isEnglishEnabled) {
            LoggerService.formatLog(this.constructor.name, "Fetch Romania news direct.");
            this.data = await ConnectorService.getRomaniaCovidNews();
        } else {
            LoggerService.formatLog(this.constructor.name, "Fetch World news direct.");
            this.data = await ConnectorService.getWorldCovidNews();
        }
        this.setState({ loadingData: false, refreshing: false });
    }

    handleRefresh() {
        this.setState(
            {
                refreshing: true,
                loadingData: true
            },
            () => this.fetchNews()
        );
    }

    toggleSwitch = () => {
        this.setState({ isEnglishEnabled: !this.state.isEnglishEnabled, loadingData: true }, () => this.fetchNews())
    }

    render() {
        LoggerService.formatLog(this.constructor.name, `render method.`);
        return (
            <View
                style={containerStyles.container}
            >
                <Title
                    style={textStyles.title}
                >
                    COVID News Page
                </Title>
                <View style={containerStyles.languageSwitch}>
                    <Text style={textStyles.languageText}>Romanian</Text>
                    <Switch
                        trackColor={{ false: "#c3cfe4", true: "#c3cfe4" }}
                        thumbColor={this.state.isEnglishEnabled ? "orange" : "#f5dd4b"}
                        value={this.state.isEnglishEnabled}
                        onValueChange={this.toggleSwitch}
                    />
                    <Text style={textStyles.languageText}>English</Text>
                </View >
                {
                    this.state.loadingData ?
                        <ActivityIndicator
                            size="large"
                            color="#bc2b78"
                            style={containerStyles.activityIndicator}
                        />
                        :
                        <FlatList
                            data={this.data.articles}
                            renderItem={({ item }) => <NewsCardContainer article={item} />}
                            keyExtractor={item => item.url}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh.bind(this)}
                        />
                }
            </View>
        );
    }

}

export default NewsScreen;

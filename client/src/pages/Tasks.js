import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import theme from "../components/styles/Styles";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ViewWeek from '@material-ui/icons/ViewWeek';
import ClearAll from '@material-ui/icons/ClearAll';
import CircularProgress from "@material-ui/core/CircularProgress";
import Timeline from "../components/task/Timeline";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import blue from '@material-ui/core/colors/blue';
import {connect} from "react-redux";
import {getAllProjects} from "../actions/project";
import {compose} from 'recompose';
import {addTask, getAllTasks, reorderTasks} from "../actions/task";
import Grid from "@material-ui/core/es/Grid/Grid";
import Project from "../components/task/kanban/Project";
import Board from "../components/task/kanban/Board";

const extraTheme = createMuiTheme({
    palette: {
        secondary: {
            main: blue[200]
        }
    },


});


class Tasks extends Component {

    state = {
        loading: true,
        value: 0,

    };

    componentDidMount() {

        const {getAllProjects, getAllTasks} = this.props;

        this.setState({
            value: this.props.location.pathname === '/todos/timeline' ? 1 : 0
        });

        Promise.all([
            getAllProjects(),
            getAllTasks()

        ]).then((response) => {
            console.log('promise', response);

            this.setState({
                 loading:false
             });

        }).catch((err) => {
            console.log(err);
        });


        //this.props.getAllProjects().then((response) => this.setState({projects: response.payload.data}));


    };

    handleChange = (event, value) => {

        this.setState({value})
    };


    render() {
        const {classes, projects, tasks, addTask, reorderTasks} = this.props;

        let content;
        if (this.state.loading) {
            content = <CircularProgress className={classes.progress} color="secondary"/>
        } else {
            content =
                <BrowserRouter>
                    <div className={classes.todoTabContainer}>
                        <MuiThemeProvider theme={extraTheme}>
                            <AppBar position="static" color="primary">

                                <Tabs
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    fullWidth
                                    indicatorColor="secondary"
                                    textColor="inherit"
                                >
                                    <Tab icon={<ViewWeek/>} label="KANBAN" component={Link} to="/tasks/kanban"/>
                                    <Tab icon={<ClearAll/>} label="TIMELINE" component={Link} to="/tasks/timeline"/>

                            </Tabs>

                            </AppBar>
                        </MuiThemeProvider>
                        <Switch>
                            <Route path="/tasks/kanban" render={() =>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        {projects.map((project, index) => {
                                            let project_tasks;
                                            if (tasks.length > 0) { project_tasks = tasks.filter(task => task.project_id === project._id)}
                                            return <Project key={index} project={project}><Board tasks={project_tasks} project_id={project._id} onTaskAdd={addTask} onTaskReorder={reorderTasks} /></Project>;

                                        })}
                                    </Grid>
                                </Grid>

                            }/>
                            <Route path="/tasks/timeline"
                                   render={() => <Timeline projects={projects} tasks={tasks}/>}/>
                        </Switch>

                    </div>
                </BrowserRouter>

        }

        return (
            <div>

                <main className={classes.layout}>
                    {/* Hero unit */}
                    <div className={classes.heroContent}>
                        <Typography component="h1" variant="h2" align="center" color="primary" gutterBottom
                                    className={classes.headingPadding}>
                            İŞLER
                        </Typography>
                        {content}
                    </div>


                </main>

            </div>


        )
    }
}


Tasks.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        projects: state.projects,
        tasks: state.tasks
    };
};


export default compose(
    connect(mapStateToProps, {getAllProjects, getAllTasks, addTask, reorderTasks }),
    withStyles(theme)
)(Tasks);

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import theme from "../styles/Styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Paper from "@material-ui/core/Paper";
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import menuContent from '../../helpers/menu'
import moment from 'moment';
import Chart from 'react-google-charts';
import green from '@material-ui/core/colors/green';
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";

const DashboardGrid = function (props) {

    const {classes, tasks, projects} = props;

    const totalBudget = projects.reduce((m, p) => p.budget + m, 0);

    const getHourlyFee = (t, a) => {
        const project = projects.find(p => p._id === t.project_id);
        return project.team.find(m => m.user._id === a.user._id).hourly_fee;
    };

    let totalCost = 0;
    tasks.map(t => {
        totalCost += t.assignees.reduce((m, a) => getHourlyFee(t, a) * a.effort + m, 0);
        return totalCost;
    });

    let performance = Math.floor(tasks.filter(t => t.status === 'done').length / tasks.filter(t => t.status === 'progress').length * 100);
    performance = isNaN(performance) || !isFinite(performance) ? 0 : performance;

    return (

        <Grid container spacing={24}>

            <Grid item xs={4}>
                <Paper className={classes.dashboardPaper}>
                    <Grid container spacing={24} direction="column" justify="center" alignItems="center">
                        <Grid item xs={8} className={classes.dashboardHeight}>
                            <CircularProgressbar
                                percentage={performance}
                                text={`${performance}%`}
                                className={classes.dashboardProgress}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="h5" component="h2" color="textPrimary" align="center">
                                Performans
                            </Typography>

                        </Grid>

                        <Grid item>
                            <Typography gutterBottom variant="caption" color="textPrimary" align="center">
                                Performans, bütün projelerdeki biten işlerin, devam eden işlere oranıyla
                                elde edilir.
                            </Typography>

                        </Grid>
                    </Grid>

                </Paper>

            </Grid>
            <Grid item xs={4}>
                <Paper className={classes.dashboardPaper}>
                    <Grid container spacing={24} direction="column" justify="center" alignItems="center">
                        <div style={{marginTop: 5}}>
                            <Chart
                                width={'300px'}
                                height={'140px'}
                                chartType="PieChart"
                                loader={<div>Yükleniyor...</div>}
                                data={[
                                    ['Task', 'Task Count'],
                                    ['Backlog', tasks.filter(t => t.status === "backlog").length],
                                    ['In Progress', tasks.filter(t => t.status === "progress").length],
                                    ['Done', tasks.filter(t => t.status === "done").length],

                                ]}
                                options={{
                                    is3D: true,
                                    pieSliceText: 'value',
                                    colors: [red[400], orange[400], green[400]],
                                    chartArea: {left: 0, top: 10, right: 0, bottom: 10},
                                    legend: {position: 'right', alignment: 'center'}
                                }}


                            />
                        </div>


                        <Grid item>
                            <Typography variant="h5" component="h2" color="textPrimary" align="center">
                                İşler
                            </Typography>

                        </Grid>
                        <Grid item>
                            <Typography gutterBottom variant="caption" color="textPrimary" align="center">
                                Bütün projelerdeki bütün işlerin kategorisel olarak gösterimi
                            </Typography>

                        </Grid>
                    </Grid>

                </Paper>

            </Grid>
            <Grid item xs={4}>
                <Paper className={classes.dashboardPaper}>
                    <Grid container spacing={24} direction="column" justify="center" alignItems="center">
                        <Grid item xs={8} className={classes.dashboardHeight}>

                            <Typography variant="h3" style={{
                                marginTop: 40,
                                fontWeight: 600,
                                color: totalBudget > totalCost ? 'green' : 'red'
                            }}>
                                {totalCost} TL
                            </Typography>


                        </Grid>
                        <Grid item>

                            <Typography variant="h5" color="textPrimary" align="center">
                                Toplam Maliyet
                            </Typography>


                        </Grid>
                        <Grid item>
                            <Typography gutterBottom variant="caption" color="textPrimary" align="center">
                                Bütün projelerin bütün işlerinin efor bazında maliyetlerinin toplamı
                            </Typography>

                        </Grid>
                    </Grid>

                </Paper>

            </Grid>


            {menuContent.map((item, index) => (
                <Grid item xs={4} key={index}>
                    <Card className={classes.cardDashboard}>

                        <CardActionArea onClick={() => props.history.push(item.link)}>
                            <CardMedia
                                className={classes.cardmedia}
                                image={`/img/${item.img}`}
                                title={item.title}
                            />
                            <CardContent className={classes.cardContent}>
                                <Typography gutterBottom variant="h5" component="h2" color="textPrimary">
                                    {item.title}
                                </Typography>
                                <Typography>
                                    {item.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>

                    </Card>
                </Grid>
            ))
            }
        </Grid>
    );

};

DashboardGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export const DashboardGridWrapper = withStyles(theme)(DashboardGrid);

class Home extends Component {
    state = {
        labelWidth: 0,
        loading: false

    };

    render() {
        const {classes, projects, auth, tasks} = this.props;
        console.log('projects from home', projects);

        return (

            <main className={classes.layout}>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Typography variant="h4" align="center" color="primary"
                                className={classes.headingPadding}>
                        Hoş geldiniz, {auth.user.name}
                    </Typography>
                    <Typography variant="h6" align="center" color="primary" gutterBottom style={{marginBottom: 20}}>
                        Sisteme en son girişiniz: {moment(auth.user.lastLogin).format("DD.MM.YYYY HH:mm")}
                    </Typography>
                    <DashboardGridWrapper projects={projects} tasks={tasks} {...this.props}/>

                </div>

            </main>

        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(theme)(Home);

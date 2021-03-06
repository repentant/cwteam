import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Delete from "@material-ui/icons/Delete"
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Add from "@material-ui/icons/Add";
import theme from '../styles/Styles';
import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';
import AddProjectDialog from "../project/AddProjectDialog";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import axios from "axios";
import {getToken} from "../../actions/auth";
import classNames from "classnames";
import Avatar from "@material-ui/core/es/Avatar/Avatar";
import ViewWeek from '@material-ui/icons/ViewWeek';
import API_URL from '../../helpers/api_url';
import Icon from "@material-ui/core/Icon";

//todo make alert dialogs as a new component

class Projects extends Component {

    state = {

        labelWidth: 0,
        open: false,
        alertOpen: false,
        deleteProjectId: '',
        selectedDate: new Date()
    };

    openDialog = () => {
        this.setState({
            open: true,
        });
    };

    closeDialog = () => {
        this.setState({open: false});
    };

    closeDeleteDialog = () => {
        this.setState({alertOpen: false});
    };

    handleProjectDeleteDialog = id => e => {
        this.setState({
            alertOpen: true,
            deleteProjectId: id
        });
    };

    handleOpenKanban = id => e => {
        this.props.history.push(`/tasks/kanban/${id}`);
    };
    handleProjectDelete = () => {
        axios.post(API_URL + '/project/delete', {id: this.state.deleteProjectId}, {
            headers: {'Authorization': 'bearer ' + getToken()},

        })
            .then(response => {
                this.closeDeleteDialog()
            })
            .catch(error => {
                console.log(error);
            });

    };

    handleProjectAdd = (data) => {

        axios.post(API_URL + '/project/add', data, {
            headers: {'Authorization': 'bearer ' + getToken()},

        })
            .then(response => {
                this.closeDialog()
            })
            .catch(error => {
                console.log(error);
            });

    };

    render() {

        const {classes, users, projects} = this.props;

        let content;

        if (projects.length === 0) {
            content =
                <div>
                <Icon style={{fontSize:100, textAlign:'center', color: '#b4b4b4'}}>error</Icon>
                <Typography component="h4" variant="h6" style={{color: '#b4b4b4', fontWeight: 200}} align="center">Proje Yok!</Typography>
                </div>
        } else {

            content = <Grid container spacing={40}>
                {projects.map(project => (

                    <Grid item xs={4} key={project._id}>
                        <Card className={classes.card}>
                            <CardContent className={classes.cardContent}>
                                <Typography gutterBottom variant="h5" component="h2" color="textPrimary">
                                    {project.title}
                                </Typography>
                                <Typography>
                                    {project.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Grid container justify="space-between" direction="row" alignItems="center">

                                    <Grid item>
                                        <Grid container direction="row" justify="flex-start">
                                            <Avatar
                                                className={classNames(classes.avatarSmall, classes.columnTitleRed)}>{project.tasks.backlog.length}</Avatar>


                                            <Avatar
                                                className={classNames(classes.avatarSmall, classes.columnTitleOrange)}>{project.tasks.progress.length}</Avatar>


                                            <Avatar
                                                className={classNames(classes.avatarSmall, classes.columnTitleGreen)}>{project.tasks.done.length}</Avatar>
                                        </Grid>
                                    </Grid>


                                    <Grid item>
                                        <Grid container direction="row" justify="flex-start">
                                            <IconButton size="small" color="primary"
                                                        onClick={this.handleOpenKanban(project._id)}>
                                                <ViewWeek/>
                                            </IconButton>

                                            <IconButton size="small" color="primary"
                                                        onClick={this.handleProjectDeleteDialog(project._id)}>
                                                <Delete/>
                                            </IconButton>

                                        </Grid>
                                    </Grid>
                                </Grid>


                            </CardActions>
                        </Card>
                    </Grid>

                ))
                }

                <Dialog
                    open={this.state.alertOpen}
                    onClose={this.closeDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" disableTypography>

                        <Typography variant="h6" color="error"> Silmek istediğinize emin misiniz?</Typography>

                    </DialogTitle>


                    <DialogActions>
                        <Button onClick={this.closeDeleteDialog} color="primary">
                            VAZGEÇ
                        </Button>
                        <Button onClick={this.handleProjectDelete} color="primary" autoFocus>
                            SİL
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>

        }

        return (
            <div>


                <AddProjectDialog open={this.state.open} addProject={this.handleProjectAdd} onClose={this.closeDialog}
                                  users={users}/>

                <main className={classes.layout}>
                    {/* Hero unit */}
                    <div className={classes.heroContent}>
                        <Typography component="h1" variant="h2" align="center" color="primary"
                                    className={classes.headingPadding}>
                            PROJELER
                        </Typography>
                        {content}

                    </div>

                    <Fab color="primary" onClick={this.openDialog} className={classes.fabButton}>
                        <Add/>

                    </Fab>


                </main>
            </div>

        )
    }
}

Projects.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(theme)(Projects);



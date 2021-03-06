import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ClearIcon from '@material-ui/icons/Clear';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Add';
import lang from './lang';

const styles = theme => ({
  listItemContent: {
    color: theme.palette.primary.contrastText,
    marginRight: 0,
    width: 24,
  },
  listItem: {
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: 0,
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
  cssUnder: {
    color: 'white',
  },
  cssUnderline: {
    // backgroundColor: 'white',
    // '&:before': {
    //   backgroundColor: '#efefed',
    // },
    '&:after': {
      borderBottomColor: 'white',
    },
  },
  inputLabel: {
    color: 'white',
  },
  hideIcon: {
    visibility: 'hidden',
  },
  listItemPrimary: {
    color: theme.palette.primary.contrastText,
  },
});
class Component extends React.Component {
  state = {
    hovered: null,
  };
  render () {
    const { classes,
      translate,
      type,
      selected,
      handleChange,
      handleClick,
      forms,
    } = this.props;
    return (
      <React.Fragment>
        {
          forms.map(o => (
            <ListItem
              key={JSON.stringify(o.path)}
              dense
              className={classes.listItem}
              onMouseEnter={() => this.setState({ hovered: o })}
              onMouseLeave={() => this.setState({ hovered: null })}
            >
              <TextField
                multiline
                fullWidth
                InputProps={{
                  classes: {
                    root: classes.cssUnder,
                    underline: classes.cssUnderline,
                  },
                }}
                InputLabelProps={{
                  classes: {
                    root: classes.inputLabel,
                  },
                  shrink: true,
                  focused: false,
                }}
                label={`[${o.variable.title}]`}
                value={o.data.text}
                onChange={e => handleChange(o, e)}
              />
              <ListItemIcon className={classNames({ [classes.hideIcon] : true })}>
                <IconButton
                  color="primary"
                  className={classes.listItemContent}
                  onClick={() => handleClick('removeText', o)}
                >
                  <ClearIcon/>
                </IconButton>
              </ListItemIcon>
            </ListItem>
          ))
        }
        <ListItem dense className={classes.listItem} button onClick={() => handleClick('addText')}>
          <ListItemIcon>
            <CreateIcon className={classes.listItemContent}/>
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemPrimary }}
            primary={lang.AddNew[translate]}
          />
        </ListItem>
      </React.Fragment>
    );
  }
}
export default connect(state => ({ translate: state.data.language.selected }))(withStyles(styles)(Component));

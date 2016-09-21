const ReactGlassData = {
  componentWillMount() {
    this.data = {};
    this._glassDataManager = new GlassDataManager(this);
    const newData = this._glassDataManager.calculateData();
    this._glassDataManager.updateData(newData);
  },
  componentWillUpdate(nextProps, nextState) {
    const saveProps = this.props;
    const saveState = this.state;
    let newData;
    try {
      // Temporarily assign this.state and this.props,
      // so that they are seen by getGlassData!
      // This is a simulation of how the proposed Observe API
      // for React will work, which calls observe() after
      // componentWillUpdate and after props and state are
      // updated, but before render() is called.
      // See https://github.com/facebook/react/issues/3398.
      this.props = nextProps;
      this.state = nextState;
      newData = this._glassDataManager.calculateData();

      // assign a style object if it doesn't exist
      if (!newData.style) {
        newData.style = {};
      }

      // inspect session variables, and assign the corresponding variables
      // NOTE:  the following code might not belong in this particular function
      // the following is still experimental
      
      if (Session.get('darkroomEnabled')) {
        newData.style.color = 'black';
        newData.style.background = 'white';

      } else {
        newData.style.color = 'white';
        newData.style.background = 'black';
      }

      // this could be another mixin
      if (Session.get('glassBlurEnabled')) {
        newData.style.filter = 'blur(3px)';
        newData.style.webkitFilter = 'blur(3px)';
      }

      // this could be another mixin
      if (Session.get('backgroundBlurEnabled')) {
        newData.style.backdropFilter = 'blur(5px)';
      }


    } finally {
      this.props = saveProps;
      this.state = saveState;
    }

    this._glassDataManager.updateData(newData);
  },
  componentWillUnmount() {
    this._glassDataManager.dispose();
  },
};

// A class to keep the state and utility methods needed to manage
// the Meteor data for a component.
class GlassDataManager {
  constructor(component) {
    this.component = component;
    this.computation = null;
    this.oldData = null;
  }

  dispose() {
    if (this.computation) {
      this.computation.stop();
      this.computation = null;
    }
  }

  calculateData() {
    const component = this.component;

    if (! component.getGlassData) {
      return null;
    }

    // When rendering on the server, we don't want to use the Tracker.
    // We only do the first rendering on the server so we can get the data right away
    if (Meteor.isServer) {
      return component.getGlassData();
    }

    if (this.computation) {
      this.computation.stop();
      this.computation = null;
    }

    let data;
    // Use Tracker.nonreactive in case we are inside a Tracker Computation.
    // This can happen if someone calls `ReactDOM.render` inside a Computation.
    // In that case, we want to opt out of the normal behavior of nested
    // Computations, where if the outer one is invalidated or stopped,
    // it stops the inner one.
    this.computation = Tracker.nonreactive(() => {
      return Tracker.autorun((c) => {
        if (c.firstRun) {
          const savedSetState = component.setState;
          try {
            component.setState = () => {
              throw new Error(
                "Can't call `setState` inside `getGlassData` as this could cause an endless" +
                " loop. To respond to Meteor data changing, consider making this component" +
                " a \"wrapper component\" that only fetches data and passes it in as props to" +
                " a child component. Then you can use `componentWillReceiveProps` in that" +
                " child component.");
            };

            data = component.getGlassData();
          } finally {
            component.setState = savedSetState;
          }
        } else {
          // Stop this computation instead of using the re-run.
          // We use a brand-new autorun for each call to getGlassData
          // to capture dependencies on any reactive data sources that
          // are accessed.  The reason we can't use a single autorun
          // for the lifetime of the component is that Tracker only
          // re-runs autoruns at flush time, while we need to be able to
          // re-call getGlassData synchronously whenever we want, e.g.
          // from componentWillUpdate.
          c.stop();
          // Calling forceUpdate() triggers componentWillUpdate which
          // recalculates getGlassData() and re-renders the component.
          component.forceUpdate();
        }
      });
    });

    if (Package.mongo && Package.mongo.Mongo) {
      Object.keys(data).forEach(function (key) {
        if (data[key] instanceof Package.mongo.Mongo.Cursor) {
          console.warn(
            "Warning: you are returning a Mongo cursor from getGlassData. This value " +
            "will not be reactive. You probably want to call `.fetch()` on the cursor " +
            "before returning it.");
        }
      });
    }

    return data;
  }

  updateData(newData) {
    const component = this.component;
    const oldData = this.oldData;

    if (! (newData && (typeof newData) === 'object')) {
      throw new Error("Expected object returned from getGlassData");
    }
    // update componentData in place based on newData
    for (let key in newData) {
      component.data[key] = newData[key];
    }
    // if there is oldData (which is every time this method is called
    // except the first), delete keys in newData that aren't in
    // oldData.  don't interfere with other keys, in case we are
    // co-existing with something else that writes to a component's
    // this.data.
    if (oldData) {
      for (let key in oldData) {
        if (!(key in newData)) {
          delete component.data[key];
        }
      }
    }
    this.oldData = newData;
  }
}

export default ReactGlassData;

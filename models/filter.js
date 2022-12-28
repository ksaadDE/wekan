Filter = new Mongo.Collection('filter');

/**
 * A Filter in WeKan. For filtering users.
 * Works similar like team or organizations.
 * One user can have multiple filters.
 */
Filter.attachSchema(
  new SimpleSchema({
    filterDisplayName: {
      /**
       * the name to display for the filter
       */
      type: String,
      optional: true,
    },
    filterDesc: {
      /**
       * the description the filter
       */
      type: String,
      optional: true,
      max: 190,
    },
    filterShortName: {
      /**
       * short name of the filter
       */
      type: String,
      optional: true,
      max: 255,
    },
    filterWebsite: {
      /**
       * website of the filter
       */
      type: String,
      optional: true,
      max: 255,
    },
    filterIsActive: {
      /**
       * status of the filter
       */
      type: Boolean,
      optional: true,
    },
    createdAt: {
      /**
       * creation date of the filter
       */
      type: Date,
      // eslint-disable-next-line consistent-return
      autoValue() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return { $setOnInsert: new Date() };
        } else {
          this.unset();
        }
      },
    },
    modifiedAt: {
      type: Date,
      denyUpdate: false,
      // eslint-disable-next-line consistent-return
      autoValue() {
        if (this.isInsert || this.isUpsert || this.isUpdate) {
          return new Date();
        } else {
          this.unset();
        }
      },
    },
  }),
);

if (Meteor.isServer) {
  Filter.allow({
    insert(userId, doc) {
      const user = Users.findOne({
        _id: userId,
      });
      if ((user && user.isAdmin) || (Meteor.user() && Meteor.user().isAdmin))
        return true;
      if (!user) {
        return false;
      }
      return doc._id === userId;
    },
    update(userId, doc) {
      const user = Users.findOne({
        _id: userId,
      });
      if ((user && user.isAdmin) || (Meteor.user() && Meteor.user().isAdmin))
        return true;
      if (!user) {
        return false;
      }
      return doc._id === userId;
    },
    remove(userId, doc) {
      const user = Users.findOne({
        _id: userId,
      });
      if ((user && user.isAdmin) || (Meteor.user() && Meteor.user().isAdmin))
        return true;
      if (!user) {
        return false;
      }
      return doc._id === userId;
    },
    fetch: [],
  });

  Meteor.methods({
    setCreateFilter(
      filterDisplayName,
      filterDesc,
      filterShortName,
      filterWebsite,
      filterIsActive,
    ) {
      if (Meteor.user() && Meteor.user().isAdmin) {
        check(filterDisplayName, String);
        check(filterDesc, String);
        check(filterShortName, String);
        check(filterWebsite, String);
        check(filterIsActive, Boolean);

        const nFilterNames = Filter.find({ filterShortName }).count();
        if (nFilterNames > 0) {
          throw new Meteor.Error('filtername-already-taken');
        } else {
          Filter.insert({
            filterDisplayName,
            filterDesc,
            filterShortName,
            filterWebsite,
            filterIsActive,
          });
        }
      }
    },
    setCreateFilterFromOidc(
      filterDisplayName,
      filterDesc,
      filterShortName,
      filterWebsite,
      filterIsActive,
    ) {
      check(filterDisplayName, String);
      check(filterDesc, String);
      check(filterShortName, String);
      check(filterWebsite, String);
      check(filterIsActive, Boolean);
      const nFilterNames = Filter.find({ filterShortName }).count();
      if (nFilterNames > 0) {
        throw new Meteor.Error('filtername-already-taken');
      } else {
        Filter.insert({
          filterDisplayName,
          filterDesc,
          filterShortName,
          filterWebsite,
          filterIsActive,
        });
      }
    },
    setFilterDisplayName(filter, filterDisplayName) {
      if (Meteor.user() && Meteor.user().isAdmin) {
        check(filter, Object);
        check(filterDisplayName, String);
        Filter.update(filter, {
          $set: { filterDisplayName: filterDisplayName },
        });
        Meteor.call('setUsersFiltersFilterDisplayName', filter._id, filterDisplayName);
      }
    },

    setFilterDesc(filter, filterDesc) {
      if (Meteor.user() && Meteor.user().isAdmin) {
        check(filter, Object);
        check(filterDesc, String);
        Filter.update(filter, {
          $set: { filterDesc: filterDesc },
        });
      }
    },

    setFilterShortName(filter, filterShortName) {
      if (Meteor.user() && Meteor.user().isAdmin) {
        check(filter, Object);
        check(filterShortName, String);
        Filter.update(filter, {
          $set: { filterShortName: filterShortName },
        });
      }
    },

    setFilterIsActive(filter, filterIsActive) {
      if (Meteor.user() && Meteor.user().isAdmin) {
        check(filter, Object);
        check(filterIsActive, Boolean);
        Filter.update(filter, {
          $set: { filterIsActive: filterIsActive },
        });
      }
    },
    setFilterAllFieldsFromOidc(
      filter,
      filterDisplayName,
      filterDesc,
      filterShortName,
      filterWebsite,
      filterIsActive,
    ) {
        check(filter, Object);
        check(filterDisplayName, String);
        check(filterDesc, String);
        check(filterShortName, String);
        check(filterWebsite, String);
        check(filterIsActive, Boolean);
        Filter.update(filter, {
          $set: {
            filterDisplayName: filterDisplayName,
            filterDesc: filterDesc,
            filterShortName: filterShortName,
            filterWebsite: filterWebsite,
            filterIsActive: filterIsActive,
          },
        });
        Meteor.call('setUsersFiltersFilterDisplayName', filter._id, filterDisplayName);
      },
    setFilterAllFields(
      filter,
      filterDisplayName,
      filterDesc,
      filterShortName,
      filterWebsite,
      filterIsActive,
    ) {
      if (Meteor.user() && Meteor.user().isAdmin) {
        check(filter, Object);
        check(filterDisplayName, String);
        check(filterDesc, String);
        check(filterShortName, String);
        check(filterWebsite, String);
        check(filterIsActive, Boolean);
        Filter.update(filter, {
          $set: {
            filterDisplayName: filterDisplayName,
            filterDesc: filterDesc,
            filterShortName: filterShortName,
            filterWebsite: filterWebsite,
            filterIsActive: filterIsActive,
          },
        });
        Meteor.call('setUsersFiltersFilterDisplayName', filter._id, filterDisplayName);
      }
    },
  });
}

if (Meteor.isServer) {
  // Index for Filter name.
  Meteor.startup(() => {
    Filter._collection.createIndex({ filterDisplayName: 1 });
  });
}

export default Filter;

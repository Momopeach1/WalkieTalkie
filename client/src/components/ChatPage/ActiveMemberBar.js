import React from 'react';
import Paper from '@material-ui/core/Paper';

import useActiveMemberBar from '../../hooks/useActiveMemberBar';

const ActiveMemberBar = () => {
  const [renderAllUsers] = useActiveMemberBar();

  return(
    <Paper className="active-member-bar">
      { renderAllUsers() }
    </Paper>
  );
};

export default ActiveMemberBar;
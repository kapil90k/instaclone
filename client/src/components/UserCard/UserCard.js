import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';

import { hideModal, showModal } from '../../redux/modal/modalActions';
import { showAlert } from '../../redux/alert/alertActions';

import { selectCurrentUser } from '../../redux/user/userSelectors';

import { followUser } from '../../services/profileService';

import Button from '../Button/Button';
import Avatar from '../Avatar/Avatar';
import UnfollowPrompt from '../UnfollowPrompt/UnfollowPrompt';

const UserCard = ({
  avatar,
  username,
  userId,
  token,
  name,
  following,
  hideModal,
  showModal,
  currentUser,
  followButton,
  onClick,
  showAlert,
}) => {
  const [isFollowing, setIsFollowing] = useState(following);
  const [loading, setLoading] = useState(false);
  let renderFollowButton = undefined;

  if (followButton) {
    const follow = async () => {
      try {
        setLoading(true);
        await followUser(userId, token);
        if (!isFollowing) {
          setIsFollowing(true);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showAlert('Could not follow the user.', () => follow());
      }
    };

    renderFollowButton = () => {
      if (username === currentUser.username) {
        return <Button disabled>Follow</Button>;
      }

      if (isFollowing) {
        return (
          <Button
            loading={loading}
            onClick={() =>
              showModal(
                {
                  options: [
                    {
                      warning: true,
                      text: 'Unfollow',
                      onClick: () => follow(),
                    },
                  ],
                  children: (
                    <UnfollowPrompt avatar={avatar} username={username} />
                  ),
                },
                'OptionsDialog'
              )
            }
            inverted
          >
            Following
          </Button>
        );
      }
      return (
        <Button loading={loading} onClick={() => follow()}>
          Follow
        </Button>
      );
    };
  }

  return (
    <div className="user-card">
      {onClick ? (
        <Avatar
          onClick={() => onClick()}
          className="avatar--small"
          imageSrc={avatar}
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <Link onClick={() => hideModal('OptionsDialog')} to={`/${username}`}>
          <Avatar className="avatar--small" imageSrc={avatar} />
        </Link>
      )}
      <div className="user-card__details">
        {onClick ? (
          <p
            onClick={() => onClick()}
            style={{ cursor: 'pointer' }}
            className="heading-4 font-bold"
          >
            {username}
          </p>
        ) : (
          <Link
            onClick={() => hideModal('OptionsDialog')}
            style={{ textDecoration: 'none' }}
            to={`/${username}`}
          >
            <p className="heading-4 font-bold">{username}</p>
          </Link>
        )}
        {name && <p className="heading-4 color-grey">{name}</p>}
      </div>
      {followButton && renderFollowButton()}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: (component) => dispatch(hideModal(component)),
  showModal: (props, component) => dispatch(showModal(props, component)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);

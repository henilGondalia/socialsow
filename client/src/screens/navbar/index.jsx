import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Badge,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, updateNotifications,setIsSearching } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import SearchBar from "components/SearchBar";
import BasicMenu from "components/BasicMenu";
import MySnackbar from "components/MySnackBar";
import useApi from "customHooks/useApi";


const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [anchorNotofication, setAnchorNotofication] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const token = useSelector((state) => state.token);
  const isSearching = useSelector((state) => state.isSearching);
  const { fetchData } = useApi();

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleOpen = (event) => {
    setAnchorNotofication(event.currentTarget);
    setOpen(true);
  };

  const handleClose = (notificationId) => {
    if(notificationId && typeof notificationId === "string"){
      dispatch(updateNotifications(notificationId));
      navigate(`/messages/${user._id}`);
    }
    setOpen(false);
  };
  
  const onSearch = (e) => {
    clearTimeout(timer);
    setSearchLoading(true);
    setTimer(
      setTimeout(async () => {
        const searchString = e.target.value;
        if (searchString) {
          const data = await fetchData(
            `users?search=${searchString}`,
            "GET",
            null,
            token
          );
          if (data) {
            setSearchResult(data);
          }
        } else {
          setSearchResult([]);
        }
      }, 1000)
    );
    setSearchLoading(false);
  }

  useEffect(()=>{
    if(searchResult.length > 0){
      dispatch(setIsSearching({isSearching:true}));
    }else{
      dispatch(setIsSearching({isSearching:false}));
    }
  },[searchResult])

  return (
    <>
      <MySnackbar />
      <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <FlexBetween gap="1.75rem">
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            SociolSow
          </Typography>
          {isNonMobileScreens && <SearchBar onSearch={onSearch} searchResult={searchResult}/>}
        </FlexBetween>

        {/* DESKTOP NAV */}
        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton onClick={() => navigate(`/messages/${user._id}`)}>
              <Message sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton anchorel={anchorNotofication} onClick={handleOpen}>
              <Badge badgeContent={notifications.length} color="primary">
                <Notifications sx={{ fontSize: "25px" }} />
              </Badge>
            </IconButton>
            <BasicMenu
              open={open}
              anchorEl={anchorNotofication}
              handleClose={handleClose}
              notifications={notifications}
            />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography overflow="hidden" textOverflow="ellipsis">
                    {fullName}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate(`/saved/${user._id}`)}>
                  Saved
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}
          >
            {/* CLOSE ICON */}
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>

            {/* MENU ITEMS */}
            <FlexBetween
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="3rem"
            >
              <IconButton
                onClick={() => dispatch(setMode())}
                sx={{ fontSize: "25px" }}
              >
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px" }} />
                )}
              </IconButton>
              <IconButton onClick={() => navigate(`/messages/${user._id}`)}>
                <Message sx={{ fontSize: "25px" }} />
              </IconButton>
              <IconButton anchorel={anchorNotofication} onClick={handleOpen}>
                <Badge badgeContent={notifications.length} color="primary">
                  <Notifications sx={{ fontSize: "25px" }} />
                </Badge>
              </IconButton>
              <BasicMenu
                open={open}
                anchorEl={anchorNotofication}
                handleClose={handleClose}
                notifications={notifications}
              />
              <Help sx={{ fontSize: "25px" }} />
              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>
                    <Typography overflow="hidden" textOverflow="ellipsis">
                      {fullName}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => navigate(`/saved/${user._id}`)}>
                    Saved
                  </MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>
                    Log Out
                  </MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
      {isSearching && (<Box sx={{
        background: "rgba(0, 0, 0, .7)",
        position: "fixed",
        width: "-webkit-fill-available",
        height: "-webkit-fill-available",
        zIndex: "1"
        
      }}/>)}
    </>
  );
};

export default Navbar;

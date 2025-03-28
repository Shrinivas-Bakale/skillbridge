import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Container,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import eventService from "../utils/eventService";
import { formatDate } from "../utils/helpers";

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Home = () => {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const result = await eventService.getEvents({
          limit: 3,
          sort: "date",
          order: "asc",
        });
        setFeaturedEvents(result.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const features = [
    {
      title: "Discover Events",
      description: "Find local events that match your interests and skills",
      icon: "🎯",
      action: () => navigate("/events"),
    },
    {
      title: "Share Skills",
      description: "Teach and learn from others in your community",
      icon: "🤝",
      action: () => navigate("/create-event"),
    },
    {
      title: "Build Network",
      description: "Connect with like-minded individuals",
      icon: "🌐",
      action: () => navigate("/events"),
    },
    {
      title: "Track Progress",
      description: "Monitor your skill development journey",
      icon: "📈",
      action: () => navigate("/profile"),
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Web Developer",
      content:
        "SkillBridge has been an amazing platform to not only learn new skills but also to teach what I know. The connections I've made here have led to numerous professional opportunities.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      name: "Rahul Patel",
      role: "UX Designer",
      content:
        "I found an incredible mentor through a SkillBridge workshop. The platform makes it easy to find events that are relevant to my interests and career goals.",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      name: "Ananya Singh",
      role: "Data Scientist",
      content:
        "The quality of workshops on SkillBridge is exceptional. I've been able to accelerate my learning journey and connect with industry experts in my field.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  const skillCategories = [
    { name: "Programming", icon: "💻", count: 42 },
    { name: "Design", icon: "🎨", count: 37 },
    { name: "Marketing", icon: "📊", count: 29 },
    { name: "Business", icon: "💼", count: 35 },
    { name: "Photography", icon: "📷", count: 23 },
    { name: "Music", icon: "🎵", count: 19 },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          textAlign: "center",
          py: 8,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(45deg, #1a4c6e 30%, #1a5c40 90%)"
              : "linear-gradient(45deg, #3498db 30%, #2ecc71 90%)",
          color: "white",
          borderRadius: { xs: 0, md: 2 },
          mb: 6,
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to SkillBridge
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Connect, Learn, and Grow Together
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate("/events")}
              >
                Explore Events
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate("/create-event")}
                sx={{ borderColor: "white", color: "white" }}
              >
                Host an Event
              </Button>
            </Grid>
          </Grid>
        </Container>
      </MotionBox>

      {/* Features Section */}
      <Container sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Why Choose SkillBridge?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Our platform offers everything you need to grow your skills and
          network
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                    cursor: "pointer",
                  }}
                  onClick={feature.action}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h2" component="div" gutterBottom>
                      {feature.icon}
                    </Typography>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Events Section */}
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "#f5f5f5"
              : "rgba(255, 255, 255, 0.05)",
          py: 6,
          mb: 8,
        }}
      >
        <Container>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Upcoming Events
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4 }}
          >
            Discover our most popular upcoming events
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {featuredEvents.length > 0 ? (
                featuredEvents.map((event, index) => (
                  <Grid item xs={12} md={4} key={event._id || index}>
                    <MotionPaper
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      elevation={3}
                      sx={{
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "background.paper"
                            : undefined,
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-4px)",
                        },
                      }}
                      onClick={() =>
                        event._id ? navigate(`/event/${event._id}`) : null
                      }
                    >
                      <CardMedia
                        component="img"
                        height="160"
                        image={
                          event.image ||
                          "https://source.unsplash.com/random/800x600?event"
                        }
                        alt={event.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{
                              fontWeight: 600,
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              lineHeight: 1.2,
                              height: "2.4em",
                              color: "text.primary",
                            }}
                          >
                            {event.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={event.type}
                            color="primary"
                            sx={{
                              ml: 1,
                              flexShrink: 0,
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "white"
                                  : undefined,
                              "& .MuiChip-label": {
                                color: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "white"
                                    : undefined,
                              },
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                          sx={{
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.palette.text.secondary
                                : undefined,
                          }}
                        >
                          {formatDate(event.date)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? theme.palette.text.secondary
                                : undefined,
                          }}
                        >
                          {event.location}
                        </Typography>
                        <Divider
                          sx={{
                            mb: 2,
                            borderColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.12)"
                                : undefined,
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={(event.host && event.host.avatar) || ""}
                              sx={{ width: 24, height: 24, mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {(event.host && event.host.name) || "Host"}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="primary.main"
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? theme.palette.primary.light
                                  : theme.palette.primary.main,
                            }}
                          >
                            {event.price > 0 ? `₹${event.price}` : "Free"}
                          </Typography>
                        </Box>
                      </CardContent>
                    </MotionPaper>
                  </Grid>
                ))
              ) : (
                <Box sx={{ textAlign: "center", width: "100%", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No upcoming events found. Check back soon!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/create-event")}
                    sx={{ mt: 2 }}
                  >
                    Create an Event
                  </Button>
                </Box>
              )}
            </Grid>
          )}

          <Container>
            <Box
              component="div"
              sx={{
                display: "inline-block",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "primary.main",
                borderRadius: 2,
                p: 1,
                pl: 3,
                pr: 3,
                mt: 4,
                fontWeight: "medium",
                color: "text.primary",
                textAlign: "center",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(52, 152, 219, 0.1)"
                    : undefined,
                "&:hover": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(52, 152, 219, 0.2)"
                      : "rgba(52, 152, 219, 0.05)",
                  cursor: "pointer",
                },
              }}
              onClick={() => navigate("/events")}
            >
              View All Events
            </Box>
          </Container>
        </Container>
      </Box>

      {/* Skill Categories Section */}
      <Container sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Explore Skills
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Discover popular skill categories in our community
        </Typography>

        <Grid container spacing={2}>
          {skillCategories.map((category, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <MotionPaper
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                elevation={2}
                sx={{
                  p: 2,
                  textAlign: "center",
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "background.paper"
                      : undefined,
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 4,
                    bgcolor: "primary.main",
                    "& .MuiTypography-root, & .MuiChip-root": {
                      color: "white",
                    },
                  },
                }}
                onClick={() => navigate(`/events?skill=${category.name}`)}
              >
                <Typography
                  variant="h3"
                  component="div"
                  gutterBottom
                  sx={{ color: "text.primary" }}
                >
                  {category.icon}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  gutterBottom
                  sx={{ color: "text.primary" }}
                >
                  {category.name}
                </Typography>
                <Chip
                  size="small"
                  label={`${category.count} events`}
                  color="primary"
                  sx={{
                    "& .MuiChip-label": {
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "white" : undefined,
                    },
                  }}
                />
              </MotionPaper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "#f9f9f9"
              : "rgba(255, 255, 255, 0.03)",
          py: 6,
          mb: 6,
        }}
      >
        <Container>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            What Our Users Say
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4 }}
          >
            Join our thriving community of skill-sharers
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionPaper
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  elevation={3}
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "background.paper"
                        : undefined,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      flexGrow: 1,
                      fontStyle: "italic",
                      color: "text.primary",
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: "text.primary" }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container sx={{ textAlign: "center", mb: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Join our community today and start sharing skills, attending events,
            and growing your network.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/register")}
          >
            Sign Up Now
          </Button>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Home;

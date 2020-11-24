import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import "../../style/dashboard.css";
import axios from "axios";
import { util } from "../util";

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    marginBottom: "50px",
  },
  newsList: {
    width: "100%",
    maxWidth: 1200,
    position: "relative",
    overflow: "auto",
    height: 500,
    backgroundColor: "#e0fbff",
  },
  listItem: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "&:hover": {
      backgroundColor: "#448af2",
    },
  },
  loading: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  itemSource: {
    fontSize: "15px",
    fontWeight: "bold",
    paddingLeft: "10px",
  },
  itemTitle: {
    textDecoration: "none",
    fontSize: "30px",
    color: "black",
  },
  itemDescription: {
    fontSize: "15px",
  },
  newsTitle: {
    fontSize: "40px",
    color: "#3f51b5",
  },
}));

export default function NewsDash(props) {
  const classes = useStyles();
  const [articles, setAtricles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (articles.length === 0) {
      axios
        .get("/api/news")
        .then((response) => {
          setAtricles(response.data.articles);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error:", error.response);
        });
    }
  }, [loading, articles]);

  return (
    <div id="newsSection" className={classes.main}>
      <div className={classes.newsTitle}>Related News</div>
      <List className={classes.newsList}>
        {loading ? (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        ) : (
          <div>
            {articles.map((article, index) => {
              return (
                <ul key={"newsArticle-".concat(index)}>
                  <ListItem divider className={classes.listItem}>
                    <div className={classes.itemSource}>
                      {article.source.name}
                    </div>
                    <a
                      href={article.url}
                      className={classes.itemTitle}
                      title={util.formatDate(new Date(article.publishedAt))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div>{article.title}</div>
                    </a>
                    <div className={classes.itemDescription}>
                      {article.description}
                    </div>
                  </ListItem>
                </ul>
              );
            })}
          </div>
        )}
      </List>
    </div>
  );
}

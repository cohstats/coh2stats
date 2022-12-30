import React, { useEffect, useRef, useState } from "react";
import { Typography } from "antd";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { KofiDonate } from "./kofi-donate";
import config from "../../config";

const { Title, Link, Text, Paragraph } = Typography;

// eslint-disable-next-line react-hooks/exhaustive-deps
const useMountEffect = (fun: { (): void }) => useEffect(fun, []);

const About: React.FC = () => {
  const donationsRef = useRef(null);
  const contributionRef = useRef(null);
  const [data, setData] = useState<Record<string, any>>();

  useEffect(() => {
    try {
      (async () => {
        const docRef = doc(getFirestore(), "stats", "global");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      })();
    } catch (e) {
      console.error("Failed to get amount of analyzed matchess", e);
    }
  }, []);

  let analyzedMatches = ". . .";
  let analyzedTopMatches = ". . .";

  if (data && data?.analyzedMatches && data?.analyzedTopMatches) {
    analyzedMatches = data?.analyzedMatches.toLocaleString();
    analyzedTopMatches = data?.analyzedTopMatches.toLocaleString();
  }

  useMountEffect(() => {
    const hash = window.location.hash;
    console.log("scrolling", hash, donationsRef);
    if (hash === "#donations" && donationsRef) {
      // @ts-ignore
      donationsRef.current.scrollIntoView();
    } else if (hash === "#bugs" && donationsRef) {
      // @ts-ignore
      contributionRef.current.scrollIntoView();
    }
  }); // Scroll on mount

  return (
    <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
      <Title level={2} style={{ paddingTop: 15 }} id={"crawler"}>
        Input Data and Crawler process
      </Title>
      <Paragraph>
        Relic doesn't provide insight or any easy way to get the match data. We are forced to
        crawl leaderboards / monitor live games and other means.
      </Paragraph>
      <h3>
        <Text strong> Update July 2022</Text>
      </h3>
      <Paragraph>
        We are now monitoring live Automatch games and gathering the players / and game data from
        them.
        <Text strong>
          {" "}
          This means that we are tracking about 95% of all played games in Automatch.{" "}
        </Text>
        It's possible that we might miss some games:
        <br />
        <Text strong>Games under 5 minutes in length:</Text>
        <br />
        We might miss some of these games as we are checking every 5 minutes. We might change this
        approach in future.
        <br />
        <Text strong> Games longer than 6 hours: </Text>
        <br />
        Yes such automatch games exists. There is about 0.0125% of them aka 1 in 80k games.
        <br />
        Such games are never gathered. As 6 hours is hard stop in our crawler system.
      </Paragraph>
      <s>
        <Paragraph>
          We are currently crawling top 200 positions from all kinds of COH2 leaderboards (1v1,2v2
          etc). This gives us 5200(~3000 unique) top players for the given day. We then proceed
          with analysing/saving their matches for the given day. This gives us ~4000 matches /
          day.
          <br />
          And we are tracking only <Text strong>auto-match games</Text> which are against players
          (filter out vs AI games).
          <br />
          Update 22/Aug/21: Query top 400 positions.
          <br />
          Update 25/Oct/21: Query top 600 positions.
        </Paragraph>
        More technical description of this process can be found{" "}
        <Link href="https://github.com/cohstats/coh2stats#crawler-process" target="_blank">
          here
        </Link>
        <br />
        <br />
        <s>
          However based on{" "}
          <Link href="http://coh2chart.com/" target="_blank">
            this data
          </Link>{" "}
          from 2017 we expect that there is around ~50k matches/day. Which means{" "}
          <Text strong>we are processing around 8% of all games</Text>.
        </s>
        <br />
        Update June 2022: Thanks to the access to the live games we know that we analyze 40% of
        all games.
        <br />
        To be precise: 1v1 - 25%, 2v2 - 37%, 3v3 - 41%, 4v4 - 47%. We aim to get to 100%
        <br />
        <br />
        The amount of data with some types of games is really a problem. You can see that winrate
        each day can really fluctuate by tens of % if the amount of games is under 1k for the
        given date.
      </s>
      <br />
      <br />
      <b>So far analyzed {analyzedMatches} matches.</b>
      <a href={"#top200"}>
        <Title level={2} style={{ paddingTop: 15 }} id={"top200"}>
          Analysis for top 200 rank only
        </Title>
      </a>
      <Paragraph>
        Analysis which is limited to top 200 rank,{" "}
        <Text strong>only includes matches where all players in the match </Text>
        are ranked top 200 for the <Text strong>particular game mode</Text> (1v1, 2v2, 3v3, 4v4).
        They have to be at least rank 200 the day the match was played to be counted in.
      </Paragraph>
      <Paragraph>
        Teams of 2, 3, 4 are included in the modes 2v2, 3v3, 4v4 however as stated above only
        matches in the mode where players are ranked top 200 are counted. Example:{" "}
        <i>teamof2 is ranked top 200, plays 4v4 - their match is not counted! </i>
        As you can see there is significantly less games in 3v3, 4v4 mode than in 1v1 and 2v2.
        It's caused by the fact that it's way likely that all 6(8) players from that mode are
        highly ranked.
      </Paragraph>
      <Paragraph>
        This statics again isn't 100% correct. The faction for which the player is ranked top200
        does not play role. We could improve this in future by limiting only their faction.
        Example:{" "}
        <i>
          Player is ranked top 200 in 1v1 wehrmacht, plays 1v1 as soviet - his match could be
          counted in (in case the other player is top 200 1v1 too).
        </i>
      </Paragraph>
      <Paragraph>
        In future we might also change this statistics to be top % and not top 200 rank because
        each faction has different amount of players which might affect the calculations.
        <br />
        It's also questionable if this approach is the right one for team games. The amount of
        matches this produces is extremely low.
      </Paragraph>
      <Paragraph>
        <Title level={5}>Difference between top 200 and regular stats?</Title>
        The regular analysis takes matches from top 200 players as base input too. However the
        difference is that regular analysis does not care about the other players. In regular
        analysis you could have one team be top 200 and other team rank 2000. Or in 4v4, only 1
        player from the match could be top 200 and other players might be much lower skill.
      </Paragraph>
      <b>So far analyzed {analyzedTopMatches} matches.</b>
      <a href={"#bugs"} ref={contributionRef}>
        <Title level={2} style={{ paddingTop: 15 }} id={"bugs"}>
          Bugs, ideas and contribution
        </Title>
      </a>
      This project is completely open source, head over to the{" "}
      <Link href="https://github.com/cohstats/coh2stats" target="_blank">
        GitHub Repo
      </Link>{" "}
      for more info. Any contributions are welcomed.
      <br />
      <br />
      You can report any bugs or feature requests on{" "}
      <Link href="https://github.com/cohstats/coh2stats/issues" target="_blank">
        GitHub issues
      </Link>
      .
      <br />
      <br />
      For any discussion, ideas or anything else. Visit our{" "}
      <Link href="https://discord.gg/jRrnwqMfkr" target="_blank">
        discord channel
      </Link>{" "}
      or head over to the coh2.org{" "}
      <Link
        href="https://www.coh2.org/topic/108057/coh2stats-com-match-and-player-statistics-2-0"
        target="_blank"
      >
        forums topic
      </Link>
      .
      <br />
      You can also use this site email or dm me{" "}
      <Link href="https://www.coh2.org/user/112252/pagep" target="_blank">
        at the forums.
      </Link>
      <br />
      <Text strong>
        {" "}
        It's strictly forbidden to connect to our API without previous consultation!
      </Text>
      <br />
      We are open to collaboration! You can download all matches that are gather{" "}
      <Link href="https://github.com/cohstats/coh2stats#open-source-data" target="_blank">
        here
      </Link>{" "}
      and we can also expose you API but you have to first ask for permission. Thank you!
      <br />
      <div ref={donationsRef}>
        <a href={"#donations"}>
          <Title level={2} style={{ paddingTop: 15 }} id={"donations"}>
            Donations and support
          </Title>
        </a>
        <Paragraph>
          The original idea was to give unlimited match history for each player. Because this is
          something which Relic with their "Recent Matches" doesn't support (They track only last
          10 games for each mode for each player). However when we started working on this
          project, we greatly underestimated the amount of data which is produced every day.
          <br />
          <s>
            We are tracking around 300k matches and the DB holding this has up to 10GB already (as
            of 16/May/2021). We are guessing COH2 to have ~50k matches/day.
          </s>
          <br />
          Update Oct/2021: The server DB costs were growing by 20% every month. To have the
          expenses under control, we had to do these changes with storing the data: Leaderboards
          (only last 3 months, older 1x a week is kept forever). Matches (only last{" "}
          {config.matchAreStoredForDays} days).
        </Paragraph>
        We are still planning to deliver advanced match overview which would bring more
        functionality and better insight into your past games. But we will most likely not be able
        to hold more matches than relic already does because of the increased cost without some
        kind of income (donations/ads?).
        <br />
        <br />
        If you would like to give financial support, you can do so. <br />
        100% of donations will go towards this project costs <br />
        <br />
        <KofiDonate />
        <br />
        <i>
          You can Donate via PayPal or Card at Ko-Fi,
          <br />
          no registration required.
        </i>
      </div>
    </div>
  );
};

export default About;

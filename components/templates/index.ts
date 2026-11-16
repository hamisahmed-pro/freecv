import type { ComponentType } from 'react';
import type { ResumeData } from '@/store/useResumeStore';

import Academic from './Academic';
import AcademicJournal from './AcademicJournal';
import Advocate from './Advocate';
import Anchor from './Anchor';
import Aperture from './Aperture';
import Arsenal from './Arsenal';
import Atelier from './Atelier';
import Bandwidth from './Bandwidth';
import Bare from './Bare';
import Barrister from './Barrister';
import Beacon from './Beacon';
import Bichrome from './Bichrome';
import Bifocal from './Bifocal';
import Billboard from './Billboard';
import Blank from './Blank';
import Breakwater from './Breakwater';
import Brief from './Brief';
import Byline from './Byline';
import Cache from './Cache';
import Caliber from './Caliber';
import Calligraphy from './Calligraphy';
import Calm from './Calm';
import Canvas from './Canvas';
import Capsule from './Capsule';
import Cascade from './Cascade';
import Chancellor from './Chancellor';
import Checkpoint from './Checkpoint';
import Chevron from './Chevron';
import Clarity from './Clarity';
import Classic from './Classic';
import Clearance from './Clearance';
import Clinician from './Clinician';
import Collage from './Collage';
import Column from './Column';
import Compass from './Compass';
import Condensed from './Condensed';
import Consul from './Consul';
import Cornerstone from './Cornerstone';
import CorporateBlue from './CorporateBlue';
import Counsel from './Counsel';
import Covenant from './Covenant';
import Crimson from './Crimson';
import Density from './Density';
import Deploy from './Deploy';
import Diplomat from './Diplomat';
import Docket from './Docket';
import Draft from './Draft';
import Drift from './Drift';
import Duotone from './Duotone';
import Elegant from './Elegant';
import ElegantEditorial from './ElegantEditorial';
import Ember from './Ember';
import Engine from './Engine';
import Ensign from './Ensign';
import Estuary from './Estuary';
import Executive from './Executive';
import ExecutiveSplit from './ExecutiveSplit';
import Flagship from './Flagship';
import Folio from './Folio';
import Forest from './Forest';
import Forge from './Forge';
import Founder from './Founder';
import Framework from './Framework';
import Frontline from './Frontline';
import Gallery from './Gallery';
import Gateway from './Gateway';
import Gauge from './Gauge';
import Gigfolio from './Gigfolio';
import Gilt from './Gilt';
import Glyph from './Glyph';
import Gutter from './Gutter';
import Harbor from './Harbor';
import Headland from './Headland';
import Hush from './Hush';
import Inscription from './Inscription';
import Interface from './Interface';
import Jumbotron from './Jumbotron';
import Kernel from './Kernel';
import Kerning from './Kerning';
import Keystone from './Keystone';
import Kindred from './Kindred';
import Ladder from './Ladder';
import Launchpad from './Launchpad';
import Laurel from './Laurel';
import Ledger from './Ledger';
import Lighthouse from './Lighthouse';
import Lucid from './Lucid';
import Lumen from './Lumen';
import Magistrate from './Magistrate';
import Mainframe from './Mainframe';
import Maitre from './Maitre';
import Manuscript from './Manuscript';
import Marginalia from './Marginalia';
import Marketing from './Marketing';
import Marquee from './Marquee';
import Masthead from './Masthead';
import Meadow from './Meadow';
import Mentor from './Mentor';
import Meridian from './Meridian';
import Merit from './Merit';
import MinimalistSplit from './MinimalistSplit';
import ModernGradient from './ModernGradient';
import Mono from './Mono';
import Mosaic from './Mosaic';
import Navigator from './Navigator';
import Navy from './Navy';
import NightShift from './NightShift';
import Noir from './Noir';
import Nomad from './Nomad';
import Northstar from './Northstar';
import Ochre from './Ochre';
import OpEd from './OpEd';
import Overclock from './Overclock';
import Palette from './Palette';
import Paper from './Paper';
import Paragon from './Paragon';
import Parchment from './Parchment';
import Parse from './Parse';
import ParsePerfect from './ParsePerfect';
import Pedagogue from './Pedagogue';
import Pivot from './Pivot';
import Pixel from './Pixel';
import Podium from './Podium';
import Polyglot from './Polyglot';
import Portrait from './Portrait';
import Practitioner from './Practitioner';
import Protocol from './Protocol';
import Pullquote from './Pullquote';
import Quarto from './Quarto';
import Rail from './Rail';
import Rainmaker from './Rainmaker';
import Reentry from './Reentry';
import Regent from './Regent';
import Rirekisho from './Rirekisho';
import Rucksack from './Rucksack';
import Satchel from './Satchel';
import Scanner from './Scanner';
import Senate from './Senate';
import Sepia from './Sepia';
import Showcase from './Showcase';
import Slate from './Slate';
import Sonnet from './Sonnet';
import Sovereign from './Sovereign';
import Split from './Split';
import Spotlight from './Spotlight';
import Spread from './Spread';
import Squeeze from './Squeeze';
import Stack from './Stack';
import Standard from './Standard';
import Still from './Still';
import Studio from './Studio';
import Summit from './Summit';
import SwissDesign from './SwissDesign';
import SwissGrid from './SwissGrid';
import SwissMinimal from './SwissMinimal';
import Syntax from './Syntax';
import Tandem from './Tandem';
import Teal from './Teal';
import TechPro from './TechPro';
import Teller from './Teller';
import Tenure from './Tenure';
import Throttle from './Throttle';
import Timeline from './Timeline';
import Trellis from './Trellis';
import Triad from './Triad';
import Tribunal from './Tribunal';
import Trifold from './Trifold';
import Tutor from './Tutor';
import TypographyFirst from './TypographyFirst';
import Uplink from './Uplink';
import Valor from './Valor';
import Vector from './Vector';
import Vellum from './Vellum';
import Vitrine from './Vitrine';
import Vivid from './Vivid';
import Warden from './Warden';
import Waypoint from './Waypoint';
import Whisper from './Whisper';
import Workshop from './Workshop';
import ZenJapanese from './ZenJapanese';
import Zigzag from './Zigzag';

export const templates = {
  Academic,
  AcademicJournal,
  Advocate,
  Anchor,
  Aperture,
  Arsenal,
  Atelier,
  Bandwidth,
  Bare,
  Barrister,
  Beacon,
  Bichrome,
  Bifocal,
  Billboard,
  Blank,
  Breakwater,
  Brief,
  Byline,
  Cache,
  Caliber,
  Calligraphy,
  Calm,
  Canvas,
  Capsule,
  Cascade,
  Chancellor,
  Checkpoint,
  Chevron,
  Clarity,
  Classic,
  Clearance,
  Clinician,
  Collage,
  Column,
  Compass,
  Condensed,
  Consul,
  Cornerstone,
  CorporateBlue,
  Counsel,
  Covenant,
  Crimson,
  Density,
  Deploy,
  Diplomat,
  Docket,
  Draft,
  Drift,
  Duotone,
  Elegant,
  ElegantEditorial,
  Ember,
  Engine,
  Ensign,
  Estuary,
  Executive,
  ExecutiveSplit,
  Flagship,
  Folio,
  Forest,
  Forge,
  Founder,
  Framework,
  Frontline,
  Gallery,
  Gateway,
  Gauge,
  Gigfolio,
  Gilt,
  Glyph,
  Gutter,
  Harbor,
  Headland,
  Hush,
  Inscription,
  Interface,
  Jumbotron,
  Kernel,
  Kerning,
  Keystone,
  Kindred,
  Ladder,
  Launchpad,
  Laurel,
  Ledger,
  Lighthouse,
  Lucid,
  Lumen,
  Magistrate,
  Mainframe,
  Maitre,
  Manuscript,
  Marginalia,
  Marketing,
  Marquee,
  Masthead,
  Meadow,
  Mentor,
  Meridian,
  Merit,
  MinimalistSplit,
  ModernGradient,
  Mono,
  Mosaic,
  Navigator,
  Navy,
  NightShift,
  Noir,
  Nomad,
  Northstar,
  Ochre,
  OpEd,
  Overclock,
  Palette,
  Paper,
  Paragon,
  Parchment,
  Parse,
  ParsePerfect,
  Pedagogue,
  Pivot,
  Pixel,
  Podium,
  Polyglot,
  Portrait,
  Practitioner,
  Protocol,
  Pullquote,
  Quarto,
  Rail,
  Rainmaker,
  Reentry,
  Regent,
  Rirekisho,
  Rucksack,
  Satchel,
  Scanner,
  Senate,
  Sepia,
  Showcase,
  Slate,
  Sonnet,
  Sovereign,
  Split,
  Spotlight,
  Spread,
  Squeeze,
  Stack,
  Standard,
  Still,
  Studio,
  Summit,
  SwissDesign,
  SwissGrid,
  SwissMinimal,
  Syntax,
  Tandem,
  Teal,
  TechPro,
  Teller,
  Tenure,
  Throttle,
  Timeline,
  Trellis,
  Triad,
  Tribunal,
  Trifold,
  Tutor,
  TypographyFirst,
  Uplink,
  Valor,
  Vector,
  Vellum,
  Vitrine,
  Vivid,
  Warden,
  Waypoint,
  Whisper,
  Workshop,
  ZenJapanese,
  Zigzag,
} satisfies Record<string, ComponentType<{ data: ResumeData }>>;

export type TemplateKey = keyof typeof templates;

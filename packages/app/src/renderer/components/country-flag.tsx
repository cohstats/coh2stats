import React from "react";

import ReactCountryFlag from "react-country-flag"; // eslint-disable-line import/no-named-as-default
import gg from "../../../assets/flags/4x3/gg.svg";

// tell webpack to import these svg's
// TODO: find a cleaner solution
require("../../../assets/flags/4x3/ac.svg");
require("../../../assets/flags/4x3/ad.svg");
require("../../../assets/flags/4x3/ae.svg");
require("../../../assets/flags/4x3/af.svg");
require("../../../assets/flags/4x3/ag.svg");
require("../../../assets/flags/4x3/ai.svg");
require("../../../assets/flags/4x3/al.svg");
require("../../../assets/flags/4x3/am.svg");
require("../../../assets/flags/4x3/ao.svg");
require("../../../assets/flags/4x3/aq.svg");
require("../../../assets/flags/4x3/ar.svg");
require("../../../assets/flags/4x3/as.svg");
require("../../../assets/flags/4x3/at.svg");
require("../../../assets/flags/4x3/au.svg");
require("../../../assets/flags/4x3/aw.svg");
require("../../../assets/flags/4x3/ax.svg");
require("../../../assets/flags/4x3/az.svg");
require("../../../assets/flags/4x3/ba.svg");
require("../../../assets/flags/4x3/bb.svg");
require("../../../assets/flags/4x3/bd.svg");
require("../../../assets/flags/4x3/be.svg");
require("../../../assets/flags/4x3/bf.svg");
require("../../../assets/flags/4x3/bg.svg");
require("../../../assets/flags/4x3/bh.svg");
require("../../../assets/flags/4x3/bi.svg");
require("../../../assets/flags/4x3/bj.svg");
require("../../../assets/flags/4x3/bl.svg");
require("../../../assets/flags/4x3/bm.svg");
require("../../../assets/flags/4x3/bn.svg");
require("../../../assets/flags/4x3/bo.svg");
require("../../../assets/flags/4x3/bq.svg");
require("../../../assets/flags/4x3/br.svg");
require("../../../assets/flags/4x3/bs.svg");
require("../../../assets/flags/4x3/bt.svg");
require("../../../assets/flags/4x3/bv.svg");
require("../../../assets/flags/4x3/bw.svg");
require("../../../assets/flags/4x3/by.svg");
require("../../../assets/flags/4x3/bz.svg");
require("../../../assets/flags/4x3/ca.svg");
require("../../../assets/flags/4x3/cc.svg");
require("../../../assets/flags/4x3/cd.svg");
require("../../../assets/flags/4x3/cf.svg");
require("../../../assets/flags/4x3/cg.svg");
require("../../../assets/flags/4x3/ch.svg");
require("../../../assets/flags/4x3/ci.svg");
require("../../../assets/flags/4x3/ck.svg");
require("../../../assets/flags/4x3/cl.svg");
require("../../../assets/flags/4x3/cm.svg");
require("../../../assets/flags/4x3/cn.svg");
require("../../../assets/flags/4x3/co.svg");
require("../../../assets/flags/4x3/cp.svg");
require("../../../assets/flags/4x3/cr.svg");
require("../../../assets/flags/4x3/cu.svg");
require("../../../assets/flags/4x3/cv.svg");
require("../../../assets/flags/4x3/cw.svg");
require("../../../assets/flags/4x3/cx.svg");
require("../../../assets/flags/4x3/cy.svg");
require("../../../assets/flags/4x3/cz.svg");
require("../../../assets/flags/4x3/de.svg");
require("../../../assets/flags/4x3/dg.svg");
require("../../../assets/flags/4x3/dj.svg");
require("../../../assets/flags/4x3/dk.svg");
require("../../../assets/flags/4x3/dm.svg");
require("../../../assets/flags/4x3/do.svg");
require("../../../assets/flags/4x3/dz.svg");
require("../../../assets/flags/4x3/ea.svg");
require("../../../assets/flags/4x3/ec.svg");
require("../../../assets/flags/4x3/ee.svg");
require("../../../assets/flags/4x3/eg.svg");
require("../../../assets/flags/4x3/eh.svg");
require("../../../assets/flags/4x3/er.svg");
require("../../../assets/flags/4x3/es-ct.svg");
require("../../../assets/flags/4x3/es-ga.svg");
require("../../../assets/flags/4x3/es.svg");
require("../../../assets/flags/4x3/et.svg");
require("../../../assets/flags/4x3/eu.svg");
require("../../../assets/flags/4x3/fi.svg");
require("../../../assets/flags/4x3/fj.svg");
require("../../../assets/flags/4x3/fk.svg");
require("../../../assets/flags/4x3/fm.svg");
require("../../../assets/flags/4x3/fo.svg");
require("../../../assets/flags/4x3/fr.svg");
require("../../../assets/flags/4x3/ga.svg");
require("../../../assets/flags/4x3/gb-eng.svg");
require("../../../assets/flags/4x3/gb-nir.svg");
require("../../../assets/flags/4x3/gb-sct.svg");
require("../../../assets/flags/4x3/gb-wls.svg");
require("../../../assets/flags/4x3/gb.svg");
require("../../../assets/flags/4x3/gd.svg");
require("../../../assets/flags/4x3/ge.svg");
require("../../../assets/flags/4x3/gf.svg");
require("../../../assets/flags/4x3/gg.svg");
require("../../../assets/flags/4x3/gh.svg");
require("../../../assets/flags/4x3/gi.svg");
require("../../../assets/flags/4x3/gl.svg");
require("../../../assets/flags/4x3/gm.svg");
require("../../../assets/flags/4x3/gn.svg");
require("../../../assets/flags/4x3/gp.svg");
require("../../../assets/flags/4x3/gq.svg");
require("../../../assets/flags/4x3/gr.svg");
require("../../../assets/flags/4x3/gs.svg");
require("../../../assets/flags/4x3/gt.svg");
require("../../../assets/flags/4x3/gu.svg");
require("../../../assets/flags/4x3/gw.svg");
require("../../../assets/flags/4x3/gy.svg");
require("../../../assets/flags/4x3/hk.svg");
require("../../../assets/flags/4x3/hm.svg");
require("../../../assets/flags/4x3/hn.svg");
require("../../../assets/flags/4x3/hr.svg");
require("../../../assets/flags/4x3/ht.svg");
require("../../../assets/flags/4x3/hu.svg");
require("../../../assets/flags/4x3/ic.svg");
require("../../../assets/flags/4x3/id.svg");
require("../../../assets/flags/4x3/ie.svg");
require("../../../assets/flags/4x3/il.svg");
require("../../../assets/flags/4x3/im.svg");
require("../../../assets/flags/4x3/in.svg");
require("../../../assets/flags/4x3/io.svg");
require("../../../assets/flags/4x3/iq.svg");
require("../../../assets/flags/4x3/ir.svg");
require("../../../assets/flags/4x3/is.svg");
require("../../../assets/flags/4x3/it.svg");
require("../../../assets/flags/4x3/je.svg");
require("../../../assets/flags/4x3/jm.svg");
require("../../../assets/flags/4x3/jo.svg");
require("../../../assets/flags/4x3/jp.svg");
require("../../../assets/flags/4x3/ke.svg");
require("../../../assets/flags/4x3/kg.svg");
require("../../../assets/flags/4x3/kh.svg");
require("../../../assets/flags/4x3/ki.svg");
require("../../../assets/flags/4x3/km.svg");
require("../../../assets/flags/4x3/kn.svg");
require("../../../assets/flags/4x3/kp.svg");
require("../../../assets/flags/4x3/kr.svg");
require("../../../assets/flags/4x3/kw.svg");
require("../../../assets/flags/4x3/ky.svg");
require("../../../assets/flags/4x3/kz.svg");
require("../../../assets/flags/4x3/la.svg");
require("../../../assets/flags/4x3/lb.svg");
require("../../../assets/flags/4x3/lc.svg");
require("../../../assets/flags/4x3/li.svg");
require("../../../assets/flags/4x3/lk.svg");
require("../../../assets/flags/4x3/lr.svg");
require("../../../assets/flags/4x3/ls.svg");
require("../../../assets/flags/4x3/lt.svg");
require("../../../assets/flags/4x3/lu.svg");
require("../../../assets/flags/4x3/lv.svg");
require("../../../assets/flags/4x3/ly.svg");
require("../../../assets/flags/4x3/ma.svg");
require("../../../assets/flags/4x3/mc.svg");
require("../../../assets/flags/4x3/md.svg");
require("../../../assets/flags/4x3/me.svg");
require("../../../assets/flags/4x3/mf.svg");
require("../../../assets/flags/4x3/mg.svg");
require("../../../assets/flags/4x3/mh.svg");
require("../../../assets/flags/4x3/mk.svg");
require("../../../assets/flags/4x3/ml.svg");
require("../../../assets/flags/4x3/mm.svg");
require("../../../assets/flags/4x3/mn.svg");
require("../../../assets/flags/4x3/mo.svg");
require("../../../assets/flags/4x3/mp.svg");
require("../../../assets/flags/4x3/mq.svg");
require("../../../assets/flags/4x3/mr.svg");
require("../../../assets/flags/4x3/ms.svg");
require("../../../assets/flags/4x3/mt.svg");
require("../../../assets/flags/4x3/mu.svg");
require("../../../assets/flags/4x3/mv.svg");
require("../../../assets/flags/4x3/mw.svg");
require("../../../assets/flags/4x3/mx.svg");
require("../../../assets/flags/4x3/my.svg");
require("../../../assets/flags/4x3/mz.svg");
require("../../../assets/flags/4x3/na.svg");
require("../../../assets/flags/4x3/nc.svg");
require("../../../assets/flags/4x3/ne.svg");
require("../../../assets/flags/4x3/nf.svg");
require("../../../assets/flags/4x3/ng.svg");
require("../../../assets/flags/4x3/ni.svg");
require("../../../assets/flags/4x3/nl.svg");
require("../../../assets/flags/4x3/no.svg");
require("../../../assets/flags/4x3/np.svg");
require("../../../assets/flags/4x3/nr.svg");
require("../../../assets/flags/4x3/nu.svg");
require("../../../assets/flags/4x3/nz.svg");
require("../../../assets/flags/4x3/om.svg");
require("../../../assets/flags/4x3/pa.svg");
require("../../../assets/flags/4x3/pe.svg");
require("../../../assets/flags/4x3/pf.svg");
require("../../../assets/flags/4x3/pg.svg");
require("../../../assets/flags/4x3/ph.svg");
require("../../../assets/flags/4x3/pk.svg");
require("../../../assets/flags/4x3/pl.svg");
require("../../../assets/flags/4x3/pm.svg");
require("../../../assets/flags/4x3/pn.svg");
require("../../../assets/flags/4x3/pr.svg");
require("../../../assets/flags/4x3/ps.svg");
require("../../../assets/flags/4x3/pt.svg");
require("../../../assets/flags/4x3/pw.svg");
require("../../../assets/flags/4x3/py.svg");
require("../../../assets/flags/4x3/qa.svg");
require("../../../assets/flags/4x3/re.svg");
require("../../../assets/flags/4x3/ro.svg");
require("../../../assets/flags/4x3/rs.svg");
require("../../../assets/flags/4x3/ru.svg");
require("../../../assets/flags/4x3/rw.svg");
require("../../../assets/flags/4x3/sa.svg");
require("../../../assets/flags/4x3/sb.svg");
require("../../../assets/flags/4x3/sc.svg");
require("../../../assets/flags/4x3/sd.svg");
require("../../../assets/flags/4x3/se.svg");
require("../../../assets/flags/4x3/sg.svg");
require("../../../assets/flags/4x3/sh.svg");
require("../../../assets/flags/4x3/si.svg");
require("../../../assets/flags/4x3/sj.svg");
require("../../../assets/flags/4x3/sk.svg");
require("../../../assets/flags/4x3/sl.svg");
require("../../../assets/flags/4x3/sm.svg");
require("../../../assets/flags/4x3/sn.svg");
require("../../../assets/flags/4x3/so.svg");
require("../../../assets/flags/4x3/sr.svg");
require("../../../assets/flags/4x3/ss.svg");
require("../../../assets/flags/4x3/st.svg");
require("../../../assets/flags/4x3/sv.svg");
require("../../../assets/flags/4x3/sx.svg");
require("../../../assets/flags/4x3/sy.svg");
require("../../../assets/flags/4x3/sz.svg");
require("../../../assets/flags/4x3/ta.svg");
require("../../../assets/flags/4x3/tc.svg");
require("../../../assets/flags/4x3/td.svg");
require("../../../assets/flags/4x3/tf.svg");
require("../../../assets/flags/4x3/tg.svg");
require("../../../assets/flags/4x3/th.svg");
require("../../../assets/flags/4x3/tj.svg");
require("../../../assets/flags/4x3/tk.svg");
require("../../../assets/flags/4x3/tl.svg");
require("../../../assets/flags/4x3/tm.svg");
require("../../../assets/flags/4x3/tn.svg");
require("../../../assets/flags/4x3/to.svg");
require("../../../assets/flags/4x3/tr.svg");
require("../../../assets/flags/4x3/tt.svg");
require("../../../assets/flags/4x3/tv.svg");
require("../../../assets/flags/4x3/tw.svg");
require("../../../assets/flags/4x3/tz.svg");
require("../../../assets/flags/4x3/ua.svg");
require("../../../assets/flags/4x3/ug.svg");
require("../../../assets/flags/4x3/um.svg");
require("../../../assets/flags/4x3/un.svg");
require("../../../assets/flags/4x3/us.svg");
require("../../../assets/flags/4x3/uy.svg");
require("../../../assets/flags/4x3/uz.svg");
require("../../../assets/flags/4x3/va.svg");
require("../../../assets/flags/4x3/vc.svg");
require("../../../assets/flags/4x3/ve.svg");
require("../../../assets/flags/4x3/vg.svg");
require("../../../assets/flags/4x3/vi.svg");
require("../../../assets/flags/4x3/vn.svg");
require("../../../assets/flags/4x3/vu.svg");
require("../../../assets/flags/4x3/wf.svg");
require("../../../assets/flags/4x3/ws.svg");
require("../../../assets/flags/4x3/xk.svg");
require("../../../assets/flags/4x3/xx.svg");
require("../../../assets/flags/4x3/ye.svg");
require("../../../assets/flags/4x3/yt.svg");
require("../../../assets/flags/4x3/za.svg");
require("../../../assets/flags/4x3/zm.svg");
require("../../../assets/flags/4x3/zw.svg");

interface IProps {
  countryCode: string;
  style?: React.CSSProperties;
}
export const CountryFlag: React.FC<IProps> = ({ countryCode, style }) => {
  const finalStyle = {
    ...{
      width: "1.5em",
      height: "1.5em",
      paddingRight: 5,
    },
    ...style,
  };
  if (countryCode.length === 0) {
    return <></>;
  }
  return (
    <ReactCountryFlag
      cdnUrl={gg.substring(0, gg.length - 6)}
      countryCode={countryCode}
      svg
      style={finalStyle}
      title={countryCode}
    />
  );
};

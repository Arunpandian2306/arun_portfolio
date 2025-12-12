import React, { useEffect, useMemo, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

function RotatingHeadline({ words, interval = 3000 }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [words.length, interval])
  return (
    <span className="cd-headline clip">
      <span className="cd-words-wrapper">
        {words.map((w, i) => (
          <b key={w} className={i === index ? 'is-visible' : 'is-hidden'}>{w}</b>
        ))}
      </span>
    </span>
  )
}

function TypingText({ text, cps = 40 }) {
  const [out, setOut] = useState('')
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setOut((p) => p + text.charAt(i))
      i += 1
      if (i >= text.length) clearInterval(id)
    }, 1000 / cps)
    return () => clearInterval(id)
  }, [text, cps])
  return <p>{out}</p>
}

function LazyBg({ src, className, style }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.style.backgroundImage = `url('${src}')`
          io.disconnect()
        }
      })
    })
    io.observe(el)
    return () => io.disconnect()
  }, [src])
  return <div ref={ref} className={className} style={style} />
}

export default function App() {
  const formRef = useRef(null)
  const contentRef = useRef(null)
  const [status, setStatus] = useState({ type: '', text: '' })
  const [active, setActive] = useState('home')
  const [isLight, setIsLight] = useState(false)
  const emailInited = useRef(false)
  const roles = useMemo(
   () => ['Backend Developer', 'API Developer', 'Database Designer', 'Manual Tester', 'Database Tester'],
    []
  )

  useEffect(() => {
    document.body.classList.add('resume-opened')
    const homeEl = document.getElementById('home')
    if (homeEl) homeEl.classList.add('visible')
    return () => {
      document.body.classList.remove('resume-opened')
    }
  }, [])

  useEffect(() => {
    const root = contentRef.current
    if (!root) return
    const sections = ['home','skills','projects','experience','contact']
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio)
        visible.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
        if (visible[0]) setActive(visible[0].target.id)
      },
      { root, threshold: [0.1], rootMargin: '0px 0px -10% 0px' }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id) => {
    const root = contentRef.current
    const el = document.getElementById(id)
    if (root && el) {
      const top = el.offsetTop
      root.scrollTo({ top, behavior: 'smooth' })
    }
    if (id === 'contact' && formRef.current) {
      formRef.current.name?.focus()
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const form = formRef.current
    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const phone = form.phone.value.trim()
    const message = form.message.value.trim()
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!name || !validEmail || !message) {
      setStatus({ type: 'error', text: 'Please fill required fields correctly.' })
      return
    }
    setStatus({ type: 'success', text: 'Sending...' })
    const combinedMessage = `Name: ${name}\nEmail: ${email}\nMobile: ${phone}\n\nMessage: ${message}`
    emailjs
      .send('service_ed7w4qc', 'template_jmm1sa9', {
        name,
        from_name: name,
        user_name: name,
        sender_name: name,
        email,
        from_email: email,
        reply_to: email,
        user_email: email,
        phone,
        user_phone: phone,
        contact_number: phone,
        message: combinedMessage,
        user_message: combinedMessage,
        message_html: combinedMessage,
        full_message: combinedMessage,
      }, { publicKey: 'poIl8fAAJa9-Xq3D9' })
      .then(
        () => {
          setStatus({ type: 'success', text: 'Message sent successfully.' })
          form.reset()
        },
        (err) => {
          setStatus({ type: 'error', text: 'Failed to send. Try again later.' })
          console.error('EmailJS error', err)
        }
      )
  }

  useEffect(() => {
    if (isLight) document.body.classList.add('light')
    else document.body.classList.remove('light')
  }, [isLight])

  return (
    <div className="deebo_fn_main">
      <div className="deebo_fn_cv">
        <div className="deebo_fn__cv no-left">
          <div className="cv__bg"></div>
          <div className="cv__bg2"></div>


          <div ref={contentRef} className="cv__content">
            <div className="cv__topnav">
              {[
                {id:'home',label:'Home'},
                {id:'skills',label:'Skills'},
                {id:'projects',label:'Projects'},
                {id:'experience',label:'Experience'},
                {id:'contact',label:'Contact'},
              ].map(item => (
                <a key={item.id} href="#" className={active===item.id?'active':''} onClick={(e)=>{e.preventDefault();scrollToSection(item.id)}}>{item.label}</a>
              ))}
              <a href="#" onClick={(e)=>{e.preventDefault();setIsLight(v=>!v)}} style={{marginLeft:'auto'}}>{isLight?'Dark':'Light'}</a>
            </div>
            <section id="home" className="section_header reveal">
              <div className="content">
                <div className="left_hero_header">
                  <div className="circle">
                    <div className="bg_img" style={{ backgroundImage: "url('img/header/arun1.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <img src="img/thumb/square.jpg" alt="" />
                    <div className="circle_holder_blue"><span></span></div>
                    <div className="circle_holder_orange"><span></span></div>
                    <div className="lines">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
                <div className="right_hero_header">
                  <div className="my_self">
                    <h4>Hello! I'm</h4>
                    <h2>
                      {["Arunpandian"]} 
                    </h2>
                    <h5>
                      <RotatingHeadline words={roles} interval={2500} />
                    </h5>
                    <TypingText text={
                      `As a Backend Developer with 2.5 years of product-based startup experience, I focus on building efficient, scalable, and secure systems that deliver real user impact. I thrive in fast-moving environments, solving complex challenges and collaborating closely with teams to bring ideas to life.

With modern AI development tools like Cursor and Trae, I can accelerate development and build end-to-end solutions rapidly — from backend services to fully functional features. Even though my core expertise is backend engineering, I have successfully developed React Native applications, demonstrating my ability to adapt and contribute across the full stack.

My goal is to create high-performance, reliable products that enhance the overall user experience and drive meaningful outcomes.`
                    } cps={40} />
                    <div style={{display:'flex',gap:12,marginTop:20,justifyContent:'center'}}>
                      <button className="fn__btn primary" onClick={()=>scrollToSection('contact')}>Contact Me</button>
                      <button className="fn__btn secondary" onClick={()=>scrollToSection('projects')}>View Projects</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id="skills" className="reveal" style={{ padding: 20 }}>
              <div className="section_title" style={{ textAlign: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 24, fontWeight: 'bold', position: 'relative', display: 'inline-block', borderBottom: '2px solid var(--mc)', paddingBottom: 6 }}>Technical Skills</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 25, justifyItems: 'center', alignItems: 'center' }}>
                {['nodejs.png','express.png','postgres.png','couch.png','elastic.png','mongo.png','jmeter.png','postman.png','rest-api-1.svg','git1.png','gitlab.png','emailjs.png','send.png','docker.png','rabbit.png','nginx.png','redis.png'].map((img) => (
                  <LazyBg key={img} src={`svg/${img}`} className="skill_card" style={{ backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
                ))}
              </div>
            </section>
            <section id="projects" className="reveal" style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
              <div className="section_title" style={{ borderBottom: '2px solid var(--mc)', paddingBottom: 10, marginBottom: 15 }}>
                <h3 style={{ fontSize: 24, fontWeight: 'bold', position: 'relative', display: 'inline-block' }}>Projects</h3>
              </div>
              <div className="fn_cs_boxed_list" style={{ padding: '10px 0' }}>
                <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                  <li style={{ marginBottom: 20 }}>
                    <div className="project_card item" style={{ padding: 15 }}>
                      <div className="item_top" style={{ marginBottom: 10 }}>
                        <h2 style={{ fontSize: 20, margin: 0, color: '#333' }}>Real Time Facial Emotion Recognition and Detection</h2>
                      </div>
                      <h4 style={{ fontSize: 16, margin: '5px 0', color: '#555' }}>Domain: Machine Learning</h4>
                      <p style={{ fontSize: 14, margin: '5px 0', color: '#666', lineHeight: 1.5 }}>Facial Emotion Recognition system that identifies the emotional state by comparing captured images with a trained dataset.</p>
                    </div>
                  </li>
                  <li style={{ marginBottom: 20 }}>
                    <div className="project_card item" style={{ padding: 15 }}>
                      <div className="item_top" style={{ marginBottom: 10 }}>
                        <h2 style={{ fontSize: 20, margin: 0, color: '#333' }}>TeamBridge (TeamShuffle) – React Native + AI</h2>
                      </div>
                      <p style={{ fontSize: 14, margin: '5px 0', color: '#666', lineHeight: 1.5 }}>Mobile app that generates fair, randomized teams using AI-assisted logic. Supports random shuffle, skill-balanced shuffle, and custom grouping with a fast, clean UI.</p>
                      <h4 style={{ fontSize: 16, margin: '10px 0', color: '#555' }}>Key Features</h4>
                      <ul style={{ listStyleType: 'disc', paddingLeft: 18, color: '#666' }}>
                        <li>AI-assisted team balancing</li>
                        <li>Random & skill-based team generation</li>
                        <li>Support for multiple players & dynamic grouping</li>
                        <li>Intuitive UI with smooth animations</li>
                        <li>Offline-friendly</li>
                        <li>Export/share team results</li>
                      </ul>
                    </div>
                  </li>
                  <li style={{ marginBottom: 20 }}>
                    <div className="project_card item" style={{ padding: 15 }}>
                      <div className="item_top" style={{ marginBottom: 10 }}>
                        <h2 style={{ fontSize: 20, margin: 0, color: '#333' }}>Snap2Text – Image to Text Extractor</h2>
                      </div>
                      <p style={{ fontSize: 14, margin: '5px 0', color: '#666', lineHeight: 1.5 }}>Utility app that converts images into clean, editable text using advanced OCR. Capture via camera or upload from gallery with fast, accurate extraction.</p>
                      <h4 style={{ fontSize: 16, margin: '10px 0', color: '#555' }}>Key Features</h4>
                      <ul style={{ listStyleType: 'disc', paddingLeft: 18, color: '#666' }}>
                        <li>OCR-powered text extraction</li>
                        <li>Capture from camera or choose from gallery</li>
                        <li>Edit, copy, and share extracted text</li>
                        <li>Multi-language text detection</li>
                        <li>Clean and minimal UI</li>
                        <li>Local processing option for privacy</li>
                      </ul>
                    </div>
                  </li>
                  <li style={{ marginBottom: 0 }}>
                    <div className="project_card item" style={{ padding: 15 }}>
                      <div className="item_top" style={{ marginBottom: 10 }}>
                        <h2 style={{ fontSize: 20, margin: 0, color: '#333' }}>Nearby Amenities Locator</h2>
                      </div>
                      <p style={{ fontSize: 14, margin: '5px 0', color: '#666', lineHeight: 1.5 }}>Location-based app that helps users discover nearby points of interest (restaurants, shops, hospitals, parks) using geolocation and map APIs with filters and directions.</p>
                      <h4 style={{ fontSize: 16, margin: '10px 0', color: '#555' }}>Key Features</h4>
                      <ul style={{ listStyleType: 'disc', paddingLeft: 18, color: '#666' }}>
                        <li>Detects user location or accepts manual input</li>
                        <li>Shows amenities on a map</li>
                        <li>Filter/search by amenity type</li>
                        <li>Displays name, type, distance, address</li>
                        <li>Clean, responsive UI across devices</li>
                        <li>Simple interface for quick discovery</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
            <section id="experience" className="reveal" style={{ fontFamily: 'Arial, sans-serif', padding: 20, marginTop: 20 }}>
              <div className="section_title" style={{ borderBottom: '2px solid var(--mc)', paddingBottom: 10, marginBottom: 15 }}>
                <h3 style={{ fontSize: 24, fontWeight: 'bold', position: 'relative', display: 'inline-block' }}>Professional Experience</h3>
              </div>
              <div className="fn_cs_boxed_list" style={{ padding: '10px 0' }}>
                <div className="item" style={{ border: '1px solid #ddd', borderRadius: 8, padding: 15, backgroundColor: '#fff' }}>
                  <div className="item_top" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontSize: 18, margin: 0, color: '#333', fontWeight: 'bold' }}>Mindsbeam Technologies Pvt Ltd, Chennai</h5>
                    <span style={{ fontSize: 14, color: '#999' }}>(08/2025 - Present • Chennai)</span>
                  </div>
                  <h4 style={{ fontSize: 16, margin: '5px 0', color: '#555' }}>Backend Developer</h4>
                  <ul style={{ listStyleType: 'disc', paddingLeft: 18, color: '#282828', lineHeight: 1.6 }}>
                    <li>Contributed to a serverless CRM using AWS Lambda, API Gateway, CloudWatch, and SSM.</li>
                    <li>Designed and optimized backend APIs in Node.js and MySQL for performance and reliability.</li>
                    <li>Monitored and resolved production issues via CloudWatch and logs to minimize downtime.</li>
                    <li>Provided weekend production support to handle urgent fixes and deployments.</li>
                    <li>Collaborated with cross-functional teams to improve stability and deliver seamless CRM features.</li>
                    <li>Integrated Amazon S3 for secure storage and retrieval of CRM data.</li>
                    <li>Proactively monitored Lambda functions and addressed bottlenecks to ensure uninterrupted services.</li>
                    <li>Improved query performance with indexing and optimized views to reduce API latency.</li>
                    <li>Applied AI-assisted code analysis and optimization to refactor complex logic and boost efficiency.</li>
                  </ul>
                </div>
                <div className="item" style={{ border: '2px solid var(--mc)', borderRadius: 8, padding: 15, backgroundColor: '#fff', marginTop: 20 }}>
                  <div className="item_top" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontSize: 18, margin: 0, color: '#333', fontWeight: 'bold' }}>Magellan X Pte Ltd / Eaglestar Marine India Pvt Ltd (MISC), Chennai</h5>
                    <span style={{ fontSize: 14, color: '#999' }}>(08/2023 - 08/2025 • Chennai)</span>
                  </div>
                  <h4 style={{ fontSize: 16, margin: '5px 0', color: '#555' }}>Associate Software Engineer (Backend Developer)</h4>
                  <ul style={{ listStyleType: 'disc', paddingLeft: 18, color: '#282828', lineHeight: 1.6 }}>
                    <li>Built and integrated RESTful APIs to connect frontend apps and third-party services.</li>
                    <li>Collaborated with frontend developers, product managers, and QA for smooth integration.</li>
                    <li>Identified and resolved critical bugs and performance bottlenecks in backend services.</li>
                    <li>Created and maintained technical documentation, API specs, and architecture diagrams.</li>
                    <li>Participated in stand-ups, sprint planning, and Agile ceremonies aligned to team goals.</li>
                    <li>Provided end-to-end production support, fixing data inconsistencies and live issues.</li>
                    <li>Conducted RCA to diagnose and prevent recurring incidents.</li>
                    <li>Supported production systems during late nights and weekends, handling urgent issues.</li>
                    <li>Managed time and priorities across feature work, bug fixes, and production support.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="contact" className="section_contact reveal" style={{ fontFamily: 'Arial, sans-serif', padding: 20, marginTop: 20 }}>
              <div className="section_title" style={{ borderBottom: '2px solid var(--mc)', paddingBottom: 10, marginBottom: 15 }}>
                <h3 style={{ fontSize: 24, fontWeight: 'bold', position: 'relative', display: 'inline-block' }}>Contact Me</h3>
              </div>
              <form ref={formRef} id="contactForm" className="contact_form" style={{ maxWidth: 800, margin: '0 auto' }} onSubmit={onSubmit}>
                <div className="items">
                  <div className="item">
                    <label className="form_label" htmlFor="name">Name *</label>
                    <input className="form_control" type="text" id="name" name="name" required />
                  </div>
                  <div className="item">
                    <label className="form_label" htmlFor="email">Email *</label>
                    <input className="form_control" type="email" id="email" name="email" required />
                  </div>
                  <div className="item">
                    <label className="form_label" htmlFor="phone">Phone</label>
                    <input className="form_control" type="text" id="phone" name="phone" />
                  </div>
                  <div className="item">
                    <label className="form_label" htmlFor="message">Message *</label>
                    <textarea className="form_control" id="message" name="message" required></textarea>
                  </div>
                  <div className="item">
                    <div className="buttons">
                      <button id="submitBtn" type="submit" className="fn__btn primary">Send</button>
                      <button type="reset" className="fn__btn danger">Cancel</button>
                    </div>
                  </div>
                  <div id="contactSuccess" className="success" style={{ display: status.type === 'success' ? 'block' : 'none' }}>{status.type === 'success' ? status.text : ''}</div>
                  <div id="contactError" className="error" style={{ display: status.type === 'error' ? 'block' : 'none' }}>{status.type === 'error' ? status.text : ''}</div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

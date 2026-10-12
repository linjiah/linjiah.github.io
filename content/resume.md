---
title: "Résumé"
description: "Linjia Hu, AI Architect at Siemens. Experience in physical AI, agent systems, and ML infrastructure."
hiddenInRss: true   # home feed /index.xml lists posts only
comments: false
hideMeta: true
showReadingTime: false
showWordCount: false
showToc: false
editPost:
  disabled: true
aliases:
  - /cv/
---

**[Download résumé (PDF)](/documents/linjia-hu-resume.pdf)** · <a href="tel:+19062315293">(906) 231-5293</a> · [linjia.hwu@gmail.com](mailto:linjia.hwu@gmail.com) · [LinkedIn](https://www.linkedin.com/in/linjia-hu-4a296818/) · Mercer Island, WA

---

**AI Architect at Siemens**

*Physical AI · Agent Systems · ML Infrastructure*

## Profile

AI Architect at **Siemens**, working on physical AI and software for agentic and generative AI systems. Current work spans distributed runtimes, inference engines, and integration with specialized hardware.

**15+ years in software engineering, machine learning, and AI systems**, including agent reasoning and evaluation at **Microsoft**, ML platforms at **Amazon**, and embedded software and edge AI at **Qualcomm**. Experience covers model development, production infrastructure, and hardware–software integration.

## Core expertise

- **Agent systems and post-training:** Reasoning, orchestration, tool use, grounding, and memory for enterprise assistants and autonomous workflows; supervised fine-tuning and reinforcement learning.
- **Evaluation and reliability:** Offline and online evaluation, task success and regression measurement, LLM-based evaluators, and release gates.
- **ML infrastructure:** Data ingestion, feature pipelines, distributed training, inference serving, and continuous learning, with attention to latency, cost, and reliability.
- **Inference and edge systems:** AI software on specialized hardware, inference engines and compilers, and on-device optimization under power and latency constraints.

## Professional experience

### AI Architect — Siemens (Intelligent Machines) *(2025–Present)*

*Physical AI · Runtimes and Inference · Seattle, WA*

Designing software architecture for **agentic and generative AI** on specialized hardware.

- Designing **distributed runtimes and cluster management** for multi-node, multi-core workloads, connecting ML and agent frameworks to specialized hardware.
- Porting and optimizing **vLLM**, **SGLang**, **llama.cpp**, and **IREE / OpenXLA**; developing a roadmap for hardware-accelerated **KV-cache** and inference optimizations. Initial prototypes achieved **~3x** throughput versus the GPU baseline used in that evaluation.

### Principal Applied Scientist — Microsoft *(2023–2025)*

*Microsoft Copilot and Enterprise Agent Systems · Redmond, WA*

Technical owner of **agent reasoning, orchestration, and LLM post-training** for enterprise assistants and agent workflows.

- Developed a reasoning architecture using structured templates and dynamic component selection: **CSAT 3.0 → 4.2** in 90 days and **~60% fewer critical reasoning failures**.
- Built **post-training workflows** with SFT and RL, supported by regression testing as a release gate.
- Integrated an **ensemble LLM-based evaluator** into CI/CD, with **0.89 Spearman correlation** against a blinded human study; reduced validation from weeks to days.
- Managed a model migration with prompt routing, trace analysis, and multi-turn regression testing, improving accuracy and latency.
- Coordinated release validation across teams, reducing the validation period from **six to under four weeks** while maintaining service-level commitments.
- Rolled out agents with **human review and staged autonomy** for bounded workflows, reducing **human escalations by about 40%** and increasing **operator throughput roughly fivefold**.

### Machine Learning Engineer / Technical Lead — Amazon *(2019–2023)*

*Amazon Go & Retail ML · Seattle, WA*

Led architecture for **ML platforms and data infrastructure** supporting ranking, retention, and computer vision.

- End-to-end ML platforms for **Amazon Go** and **Retail ML**: streaming/batch processing, **PB-scale** image and video storage, labeling, feature pipelines, distributed training, low-latency inference globally.
- Multi-host/multi-GPU training and inference; **training from weeks to under one day**, **50%+** infrastructure cost reduction.
- Experimentation and deployment platforms: **A/B**, shadow testing, canaries, kill-switches for peak-traffic iteration.
- Real-time video ingestion, automated ground truth, **continuous learning** with reproducibility and quality guardrails.
- Platform guardrails for reliability, safety, and cost—multiple teams shipping independently at scale.

### Staff Software Engineer / Engineering Manager — Qualcomm *(2013–2019)*

*Embedded Systems & Edge AI · San Diego, CA*

- Technical lead for **world-first 5G** embedded stack and multiple **4G** products.
- High-performance data transport and power-efficient downlink/uplink systems.
- **Edge AI** on SoC: DSP, NPU, mobile GPU.

### Research Assistant — Michigan Technological University *(2009–2013)*

- Massively parallel **GPU** algorithms (**up to ~100x** speedups) for computer vision and video streaming.
- Scalable **GPU / GPU-cluster** indexing and search for object detection and recognition.
- Research projects: real-time **3D point cloud** processing on heterogeneous GPU and multicore systems; parallel **fountain-code** decoding on GPU (**Raptor >40x**, **RaptorQ >160x** faster than the baseline).

### Senior Software Engineer — ZTE *(2007–2009)*

- Embedded and real-time software, **Linux kernel** components, and drivers for SoC platforms.

## Technical skills

- **Agent & LLM systems:** Reasoning, orchestration, tools, memory, grounding, RAG, alignment/post-training (SFT, DPO, RM, PPO, GRPO), evaluation and reliability.
- **Inference & serving:** vLLM, SGLang, Ray Serve, Triton; FlashAttention, PagedAttention, RadixAttention; Kubernetes, Docker.
- **ML & data platforms:** Streaming + batch, feature store, labeling, distributed training/inference, monitoring, continuous learning; Spark/PySpark, Ray.
- **Distributed & edge:** Multi-host/multi-GPU, low latency; on-device inference, quantization, distillation, pruning; IREE, OpenXLA, hardware–software co-design.
- **Programming:** Python, C/C++, Java, Go.

## Education

- **Ph.D. & M.S., Computer Science** — Michigan Technological University, Houghton, MI — *Massively parallel computing and computer vision*
- **M.E., Software Engineering** — University of Science and Technology of China (USTC), Hefei — *Embedded systems and real-time operating systems*
- **B.E., Electrical Engineering** — Central South University (CSU), Changsha

## Research and publications

**12+** peer-reviewed publications in computer vision, GPU computing, and forward error correction. Selected publications are listed below; search **Google Scholar** for *Linjia Hu* (Michigan Tech, GPU, parallel algorithms) for the complete record.

**Nearest-neighbor search and 3D descriptors on GPUs**

- *Massive Parallelization of Approximate Nearest Neighbor Search on KD-tree for High-Dimensional Image Descriptor Matching* — Journal of Visual Communication and Image Representation (Elsevier JVCI), 2017
- *Parallel Randomized KD-Tree Forest on GPU Cluster for Image Descriptor Matching* — IEEE International Symposium on Circuits and Systems (ISCAS), 2016
- *G-SHOT: GPU Accelerated 3D Local Descriptor for Surface Matching* — Journal of Visual Communication and Image Representation (Elsevier JVCI), 2015
- *Massively Parallel KD-Tree Construction and Nearest Neighbor Search Algorithms* — IEEE ISCAS, 2015
- *A 3D Local Descriptor SHOT on Massively Parallel Processors* — IEEE International Conference on Consumer Electronics (ICCE), 2015
- *Parallel 3D Local Descriptor on NVIDIA GPU* — GPU Technology Conference (GTC), 2014

**Forward error correction on GPUs and heterogeneous systems**

- *Forward Error Correction with Raptor GF(2) and GF(256) Codes on GPU* — IEEE Transactions on Consumer Electronics, 2013
- *Forward Error Correction with RaptorQ Code on Heterogeneous System* — IEEE ISCAS, 2013
- *Implementation and Evaluation of Raptor Code on GPU* — 16th IEEE International Symposium on Consumer Electronics, 2012
- *Implementation of Raptor Code on GPU* — GPU Technology Conference (GTC), 2012

## Languages and memberships

- **Languages:** Mandarin Chinese (native), English (professional working proficiency).
- **Professional memberships:** IEEE and ACM, member since 2012.

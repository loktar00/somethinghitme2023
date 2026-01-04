---
title: "Cloudflare Tunneling and Access Control for locally hosted services"
date: "2026-01-04"
teaser: "I've been running locall LLMs for over a year at this point, and while it's been great my family members have asked for access some who don't live in the house anymore. There's a myriad of services that do this, in the past I've used ngrok for solutions, or even just setup a vpn through my home router and given access to my kids, none of them were as straightforward as what I found using Cloudflare."
tags: "security, hosting, cloudflare, local"
---

### The Scenerio

I've been running locall LLMs for over a year at this point, and while it's been great my family members have asked for access some who don't live in the house anymore. There's a myriad of services that do this, in the past I've used ngrok for solutions, or even just setup a vpn through my home router and given access to my kids, none of them were as straightforward as what I found using Cloudflare.

### Enter Cloudflare

I've been on a recent Cloudflare kick, granted of course I started RIGHT before their most recent outages, but putting those aside I've been incredibly happy with their services.

I've used them on my wifes real estate site to block a few regions that have been needlessly beating up the site along with defailt AI blocking, additionally at my day job I directed the engineering team to look into it as a possible solution to some spam we were dealing with. After acknowledging this would be a good fit we implemented it across all of our publically hosted applications and not only has it significantly decreased spam (practically to 0), it also cached a few services increasing speed acrossed the applications significantly, over 50% in some cases.

### Local Services and Tunnels

As I mentioned I run a few local AI instances on proxmox servers in my home (I'll share specs and setups in a future post), however they're all accesible locally within the network. I really never had a major reason to expose any of them until I recently got n8n up and running, and had family members if they could access some of my local services since I have some rag implementations setup for the Bible and other knowledge sets.

The rest of this post will go over setting up a Cloudflare tunnel, and putting email access in front of it, along with the why behind it.

#### Step 1 If you don't have a Cloudflare set one up (This is all free by the way!)

I wont go through the setup here, however what you're going to want to do once setup is look for Cloudflare one / Zero Trust, and get an account setup through that as well. The default free plan is 50 users, and it's free.

![](images/step 1.PNG)

#### Step 2 Get a domain name and connect it to Cloudflare

This part is incredibly simple and one of the strong points of Cloudflare. All settings you currently have will be added and proxied.

![](images/step 2.PNG)

Be sure to look them over to ensure all settings have been properly picked up. Once you've confirmed everything looks right, you'll see nameservers provided by Cloudflare. If you're hosting your domain via a third party provider you just need to update your nameservers with them and cloudflare will take over.

> Note Any hosting endpoints, websites etc. will continue working just as they were before, this isn't a traditional nameserver swap where you lose everything, Cloudflare now has control but it proxies everything that was existing prior.

#### Step 3 Zero Trust setup

![](images/step 3.PNG)

If you setup Cloudflare One / Zero trust previously to this step you'll see the Zero Trust option, if not search for Zero Trust and you'll be prompted to set up an account. You have to add a form of payment, however it is free as long as you stay within the requirements (Something we will be doing within this tutorial).

Once you select Zero Trust go to Networks and Overview. You'll see Manage Tunnels, this is where you want to go.

#### Step 4 Setting up the Tunnel

For the first screen you'll have two choices, Select Cloudflared.

You may be asking how this works.. if not feel free to skip the following and random story I interject.

How this all works is similar to other services which offer similar features. You have a service which runs inside of your network letting Cloudflare know who you are and where you're located.

Funny story, an old friend of mine rolled his own version of this back in the early 2000's, from work he wanted to connect to his IRC server but like most of us was on a dynamic IP from his ISP that switched more often than he'd like. He had a script which would run and FTP to an external server he owned a txt file with only the ip address of his home network, his IRC script would always hit that txt file in order to get to his home hosted IRC server, and when I say IRC server in reality it was something a few of us did, it was a server running our irc clients we'd ssh into so all logs and records stayed off of work machines.


Back to the setup, once you choose Cloudflared you'll have to provide a tunnel name, this can be anything it's only the label within Cloudflare.

![](images/setup tunnel.PNG)

Choose the enviornment you're in, in my case it's Debian, you'll get the commands or executable to run based on the platform and architecture chosen. It's incredibly simple, the main thing they call out and of course is always a good idea don't share your token with anyone. In Debian I chose the option to run as a service, since if I boot my container I want it all working by default.


#### Step 5 Setting up the Domain and pointing to your instance

This is probably the biggest potential "gotcha" with the entire setup. In your subdomain use any valid subdomain and choose the domain you added earlier.

For service this is the most important. For Type if you're actually running HTTPS choose HTTPS here, however if you're running HTTP locally (I am on most of my instances) choose HTTP here. Cloudflare will still use HTTPS so you don't need to worry.

For URL this is one of the biggest gotcha's I've seen when looking at tutorials and setups, (comments in videos on reddit ect and really the reason I decided to write this). Use the URL your service is using.

For example, if it's using `http://localhost:8080` paste `http://localhost:8080` within the box. If it's using `http://0.0.0.0:1234` us `http://0.0.0.0:1234` do not use your external IP address here, or the local IP if it's not explicitely exposing that. For example if using `0.0.0.0` and you commonly connect with `192.168.1.23` you still want to use `0.0.0.0`.

Once you're set hit save. Test your tunnel it should work almost immediately.

> It's important to note just because a tunnel is setup doesn't mean you lose your original internal way to access the application or service. If you commonly use an internal static IP address that will continue to work and bypass Cloudflare.

Now you _could_ stop here, however your service is accessible by anyone and everyone over the internet. Even for instances like OpenwebUI for example which do have internal Authentication methods I really don't feel like having it exposed, and I don't feel like dealing with potential network bottlenecks if I happened to suddenly get hit with tons of requests (although Cloudflare should filter most out).

So it's a good idea to setup Access control, which Cloudflare One also provides and it's incredibly easy to setup.

#### Step 6 Access Control

Navigate to Access Controls and Policies. This is where you can setup reusable policies to apply to any of your Applications.

![](images/addanapplication.PNG)

Go to add Policy, within this screen you will have the option for a whole plethora of authentication methods to include facial scanning. Personally I just chose Email which is a whitelist of email addresses you provide. You can also control how often you want the token to expire as well. I left mine set at 24 hours.

#### Step 7 Setup an Application

Now that you have an access control policy setup you're going to want to setup an application pointing to your tunnel so you can actually use the access control policy.

Navigate to Access Controls/Applications and click to Add an application. Since this is for a local service choose Self-hosted.

![](images/Access Control Applications.PNG)

You'll be presented with the screen below. Give it a name to identify it, choose your session duration and select `Add Public Hostname`

![](images/public hostname.PNG)

Optiona subdomain is the one you used when setting up your tunnel above, and choose the domain which has the subdomain on it.

Next go down a little to Access Policies, click `Select Existing Policies` and choose the one you setup earlier.

![](images/Access control policies.PNG)

Finally test your url and you should be presented with a screen similar to below, this will depend on the authentication method chosen in this case it's email.

![](images/cloudflareaccess.PNG)

### Conclusion

That's it! You should be all setup, now your local services are exposed but access is controlled through your Cloudflare security policy. Note once a user goes through this they will also need to authenticate with whatever your service has as well, for example if it's openwebui they'll still need to login to their openwebui account if they weren't already.
